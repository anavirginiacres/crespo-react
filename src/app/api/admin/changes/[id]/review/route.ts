import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyChangeRequest } from "@/lib/admin/changes";
import { requireAdminUser } from "@/lib/admin/auth";
import type { ChangeAction } from "@/lib/admin/types";
import { adminErrorResponse } from "@/lib/admin/api";

type RouteContext = {
  params: { id: string };
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const admin = await requireAdminUser();
    const changeId = Number(params.id);

    if (!Number.isInteger(changeId) || changeId <= 0) {
      return NextResponse.json({ error: "Invalid change id" }, { status: 400 });
    }

    const body = (await request.json()) as {
      decision?: "approve" | "reject";
      reviewNote?: string;
    };

    if (body.decision !== "approve" && body.decision !== "reject") {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const change = await prisma.productChangeRequest.findUnique({
      where: { id: changeId },
    });

    if (!change) {
      return NextResponse.json({ error: "Change not found" }, { status: 404 });
    }

    if (change.status !== "PENDING") {
      return NextResponse.json(
        { error: "Change was already reviewed" },
        { status: 409 }
      );
    }

    if (body.decision === "reject") {
      const rejected = await prisma.productChangeRequest.update({
        where: { id: changeId },
        data: {
          status: "REJECTED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          reviewNote: body.reviewNote?.trim() || null,
        },
      });

      return NextResponse.json({ change: rejected });
    }

    const appliedProductId = await applyChangeRequest(
      change.action as ChangeAction,
      change.productId,
      change.payload
    );

    const approved = await prisma.productChangeRequest.update({
      where: { id: changeId },
      data: {
        status: "APPROVED",
        productId: appliedProductId ?? change.productId,
        reviewedById: admin.id,
        reviewedAt: new Date(),
        reviewNote: body.reviewNote?.trim() || null,
      },
    });

    return NextResponse.json({
      change: approved,
      productId: appliedProductId,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
