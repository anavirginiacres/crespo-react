import { prisma } from "@/lib/prisma";
import { getProductQuantityOptions } from "@/lib/productOptions";

export type ProductQuantityOptionsMap = Record<number, string[]>;

export async function getProductQuantityOptionsMap(): Promise<ProductQuantityOptionsMap> {
  const products = await prisma.product.findMany({
    select: { id: true, quantity: true },
  });

  const map: ProductQuantityOptionsMap = {};

  for (const product of products) {
    const options = getProductQuantityOptions(product.quantity);
    if (options.length > 0) {
      map[product.id] = options;
    }
  }

  return map;
}

export type ProductFilters = {
  q?: string;
  categoria?: number;
  subcategoria?: number;
};

function matchesSearch(
  name: string,
  tags: string | null | undefined,
  term: string
) {
  const lower = term.toLowerCase();
  return (
    name.toLowerCase().includes(lower) ||
    (tags?.toLowerCase().includes(lower) ?? false)
  );
}

export type ProductSuggestion = {
  id: number;
  name: string;
  caption: string | null;
  tags: string | null;
};

export async function getProductSuggestions(
  query: string,
  limit = 8
): Promise<ProductSuggestion[]> {
  const term = query.trim();
  if (term.length < 3) return [];

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      caption: true,
      tags: true,
    },
    orderBy: { name: "asc" },
  });

  return products
    .filter((product) => matchesSearch(product.name, product.tags, term))
    .slice(0, limit);
}

export async function getNewProducts(limit = 4) {
  return prisma.product.findMany({
    where: { new_product: true },
    take: limit,
    orderBy: { id: "desc" },
    include: {
      category: true,
    },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
      images: true,
    },
  });
}

export async function getProducts(filters: ProductFilters = {}) {
  const products = await prisma.product.findMany({
    where: {
      ...(filters.categoria ? { id_category: filters.categoria } : {}),
      ...(filters.subcategoria ? { id_subcategory: filters.subcategoria } : {}),
    },
    include: {
      category: true,
      subcategory: true,
    },
    orderBy: { name: "asc" },
  });

  const term = filters.q?.trim();
  if (!term) return products;

  return products.filter((product) =>
    matchesSearch(product.name, product.tags, term)
  );
}

export async function getCatalogProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      subcategory: true,
    },
    orderBy: { name: "asc" },
  });
}
