import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/admin/auth";
import { submitOrApplyChange } from "@/lib/admin/changes";
import { queryProductChanges } from "@/lib/admin/changesQuery";
import type { ChangeAction } from "@/lib/admin/types";
import { adminErrorResponse } from "@/lib/admin/api";

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser();
    const { searchParams } = new URL(request.url);

    const result = await queryProductChanges({
      userId: user.id,
      userRole: user.role,
      statusGroup: searchParams.get("statusGroup"),
      q: searchParams.get("q"),
      product: searchParams.get("product"),
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    return NextResponse.json(result);
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const body = (await request.json()) as {
      action?: ChangeAction;
      productId?: number | null;
      payload?: unknown;
    };

    if (!body.action || body.payload === undefined) {
      return NextResponse.json(
        { error: "action and payload are required" },
        { status: 400 }
      );
    }

    const result = await submitOrApplyChange({
      action: body.action,
      productId: body.productId ?? null,
      payload: body.payload,
      userId: user.id,
      userRole: user.role,
    });

    return NextResponse.json(result);
  } catch (error) {
    return adminErrorResponse(error);
  }
}
