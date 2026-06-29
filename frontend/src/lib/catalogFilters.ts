import { slugify } from "@/lib/slug";
import type { CategoryNav } from "@/lib/api";

export function resolveCatalogFilters(
  categories: CategoryNav[],
  searchParams: URLSearchParams
) {
  const query = searchParams.get("q")?.trim() ?? "";
  const categorySlug = searchParams.get("categoria")?.trim() ?? "";
  const subcategorySlug = searchParams.get("subcategoria")?.trim() ?? "";

  const category = categorySlug
    ? categories.find((item) => item.slug === slugify(categorySlug)) ?? null
    : null;

  const subcategory =
    category && subcategorySlug
      ? category.subcategories.find(
          (item) => item.slug === slugify(subcategorySlug)
        ) ?? null
      : null;

  return {
    search: query,
    categoryIds: subcategory ? [] : category ? [category.id] : [],
    subcategoryIds: subcategory ? [subcategory.id] : [],
    sort: "asc" as const,
    catalogKey: `${query}|${category?.id ?? ""}|${subcategory?.id ?? ""}`,
  };
}
