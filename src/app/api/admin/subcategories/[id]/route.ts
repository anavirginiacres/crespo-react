import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as { name?: string };

    const subcategoryId = Number(params.id);
    const name = body.name?.trim() ?? "";

    if (!Number.isInteger(subcategoryId) || subcategoryId <= 0) {
      return NextResponse.json(
        { error: "Subcategoría inválida" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const existing = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Subcategoría no encontrada" },
        { status: 404 }
      );
    }

    const subcategory = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { name },
    });

    return NextResponse.json({ subcategory });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
