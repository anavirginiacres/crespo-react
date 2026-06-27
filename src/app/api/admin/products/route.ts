import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function buildProductSearchWhere(params: {
  q?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
}): Prisma.ProductWhereInput {
  const conditions: Prisma.ProductWhereInput[] = [];
  const query = params.q?.trim();

  if (query) {
    const orConditions: Prisma.ProductWhereInput[] = [
      { name: { contains: query } },
      { caption: { contains: query } },
      { tags: { contains: query } },
    ];

    const numericId = Number(query);
    if (Number.isInteger(numericId) && numericId > 0) {
      orConditions.push({ id: numericId });
    }

    conditions.push({ OR: orConditions });
  }

  const categoryId = Number(params.categoryId);
  if (Number.isInteger(categoryId) && categoryId > 0) {
    conditions.push({ id_category: categoryId });
  }

  const subcategoryId = Number(params.subcategoryId);
  if (Number.isInteger(subcategoryId) && subcategoryId > 0) {
    conditions.push({ id_subcategory: subcategoryId });
  }

  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0];
  return { AND: conditions };
}

export async function GET(request: Request) {
  try {
    await requireSessionUser();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = Math.min(
      parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where = buildProductSearchWhere({ q, categoryId, subcategoryId });

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          caption: true,
          image: true,
          tags: true,
          new_product: true,
          id_category: true,
          id_subcategory: true,
          category: { select: { name: true } },
          subcategory: { select: { name: true } },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
