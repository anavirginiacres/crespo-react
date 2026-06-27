import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function parseDateStart(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseDateEnd(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function queryProductChanges(input: {
  userId: number;
  userRole: "ADMIN" | "USER";
  statusGroup?: string | null;
  q?: string | null;
  product?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  page?: string | null;
  limit?: string | null;
}) {
  const page = parsePositiveInt(input.page ?? null, 1);
  const limit = Math.min(
    parsePositiveInt(input.limit ?? null, DEFAULT_LIMIT),
    MAX_LIMIT
  );

  const conditions: Prisma.ProductChangeRequestWhereInput[] = [];

  if (input.userRole === "USER") {
    conditions.push({ submittedById: input.userId });
  }

  if (input.statusGroup === "pending") {
    conditions.push({ status: "PENDING" });
  } else if (input.statusGroup === "completed") {
    conditions.push({ status: { in: ["APPROVED", "REJECTED"] } });
  }

  const dateFrom = parseDateStart(input.dateFrom ?? null);
  const dateTo = parseDateEnd(input.dateTo ?? null);

  if (dateFrom || dateTo) {
    conditions.push({
      createdAt: {
        ...(dateFrom ? { gte: dateFrom } : {}),
        ...(dateTo ? { lte: dateTo } : {}),
      },
    });
  }

  const productQuery = input.product?.trim();
  if (productQuery) {
    const productNumericId = Number(productQuery);
    if (Number.isInteger(productNumericId) && productNumericId > 0) {
      conditions.push({ productId: productNumericId });
    } else {
      const matchingProducts = await prisma.product.findMany({
        where: { name: { contains: productQuery } },
        select: { id: true },
      });

      conditions.push({
        productId: {
          in: matchingProducts.map((product) => product.id),
        },
      });
    }
  }

  const keyword = input.q?.trim();
  if (keyword) {
    const orConditions: Prisma.ProductChangeRequestWhereInput[] = [
      { payload: { contains: keyword } },
      { action: { contains: keyword } },
      { submittedBy: { username: { contains: keyword } } },
    ];

    const numericId = Number(keyword);
    if (Number.isInteger(numericId) && numericId > 0) {
      orConditions.push({ id: numericId }, { productId: numericId });
    }

    const matchingProducts = await prisma.product.findMany({
      where: { name: { contains: keyword } },
      select: { id: true },
    });

    if (matchingProducts.length > 0) {
      orConditions.push({
        productId: { in: matchingProducts.map((product) => product.id) },
      });
    }

    conditions.push({ OR: orConditions });
  }

  const where: Prisma.ProductChangeRequestWhereInput =
    conditions.length === 0
      ? {}
      : conditions.length === 1
        ? conditions[0]
        : { AND: conditions };

  const [total, changes] = await Promise.all([
    prisma.productChangeRequest.count({ where }),
    prisma.productChangeRequest.findMany({
      where,
      include: {
        submittedBy: { select: { id: true, username: true, role: true } },
        reviewedBy: { select: { id: true, username: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const productIds = [
    ...new Set(
      changes
        .map((change) => change.productId)
        .filter((id): id is number => typeof id === "number")
    ),
  ];

  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          include: {
            category: { select: { name: true } },
            subcategory: { select: { name: true } },
            images: { select: { id: true, src: true } },
          },
        })
      : [];

  const productMap = new Map(products.map((product) => [product.id, product]));

  const changesWithContext = changes.map((change) => ({
    ...change,
    currentProduct: change.productId
      ? productMap.get(change.productId) ?? null
      : null,
  }));

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    changes: changesWithContext,
    total,
    page,
    limit,
    totalPages,
  };
}
