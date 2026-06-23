import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type CategoryNav = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  subcategories: {
    id: number;
    name: string;
    slug: string;
  }[];
};

function mapCategoryNav(
  category: Awaited<ReturnType<typeof fetchCategoriesRaw>>[number]
): CategoryNav {
  return {
    id: category.id,
    name: category.name,
    slug: slugify(category.name),
    icon: category.icon,
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      slug: slugify(subcategory.name),
    })),
  };
}

async function fetchCategoriesRaw() {
  return prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { id: "asc" },
  });
}

export async function getCategories(): Promise<CategoryNav[]> {
  const categories = await fetchCategoriesRaw();
  return categories.map(mapCategoryNav);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await fetchCategoriesRaw();
  const category = categories.find((item) => slugify(item.name) === slug);
  if (!category) return null;

  return category;
}

export async function getSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string
) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const subcategory = category.subcategories.find(
    (item) => slugify(item.name) === subcategorySlug
  );
  if (!subcategory) return null;

  return prisma.subcategory.findUnique({
    where: { id: subcategory.id },
    include: { category: true },
  });
}
