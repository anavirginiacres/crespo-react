import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as {
      id_category?: number;
      name?: string;
    };

    const idCategory = Number(body.id_category);
    const name = body.name?.trim() ?? "";

    if (!Number.isInteger(idCategory) || idCategory <= 0) {
      return NextResponse.json(
        { error: "Categoría inválida" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: idCategory },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        id_category: idCategory,
        name,
      },
    });

    return NextResponse.json({ subcategory }, { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
