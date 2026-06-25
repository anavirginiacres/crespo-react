import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireSessionUser();

    const productId = Number(params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        subcategory: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
