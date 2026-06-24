export type SortOrder = "asc" | "desc";

export type CatalogFiltersState = {
  search: string;
  categoryIds: number[];
  subcategoryIds: number[];
  sort: SortOrder;
};

export type CatalogProduct = {
  id: number;
  name: string;
  caption: string | null;
  colors: string | null;
  materials: string | null;
  measures: string | null;
  details: string | null;
  tags: string | null;
  id_category: number;
  id_subcategory: number;
  category: { id: number; name: string };
  subcategory: { id: number; name: string };
  images: { src: string }[];
};

export type FilterPill =
  | { type: "search"; id: string; label: string }
  | { type: "category"; id: string; label: string; categoryId: number }
  | { type: "subcategory"; id: string; label: string; subcategoryId: number };

export function parseOptionList(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchesSearch(product: CatalogProduct, term: string) {
  const lower = term.toLowerCase();
  return (
    product.name.toLowerCase().includes(lower) ||
    (product.tags?.toLowerCase().includes(lower) ?? false) ||
    (product.caption?.toLowerCase().includes(lower) ?? false)
  );
}

export function filterAndSortProducts(
  products: CatalogProduct[],
  filters: CatalogFiltersState
) {
  let result = products;

  if (filters.categoryIds.length > 0) {
    result = result.filter((product) =>
      filters.categoryIds.includes(product.id_category)
    );
  }

  if (filters.subcategoryIds.length > 0) {
    result = result.filter((product) =>
      filters.subcategoryIds.includes(product.id_subcategory)
    );
  }

  const term = filters.search.trim();
  if (term) {
    result = result.filter((product) => matchesSearch(product, term));
  }

  return [...result].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name, "es", {
      sensitivity: "base",
    });
    return filters.sort === "asc" ? comparison : -comparison;
  });
}

export function buildFilterPills(
  filters: CatalogFiltersState,
  categories: { id: number; name: string; subcategories: { id: number; name: string }[] }[]
): FilterPill[] {
  const pills: FilterPill[] = [];

  if (filters.search.trim()) {
    pills.push({
      type: "search",
      id: "search",
      label: `"${filters.search.trim()}"`,
    });
  }

  for (const categoryId of filters.categoryIds) {
    const category = categories.find((item) => item.id === categoryId);
    if (category) {
      pills.push({
        type: "category",
        id: `category-${categoryId}`,
        label: category.name,
        categoryId,
      });
    }
  }

  for (const subcategoryId of filters.subcategoryIds) {
    for (const category of categories) {
      const subcategory = category.subcategories.find(
        (item) => item.id === subcategoryId
      );
      if (subcategory) {
        pills.push({
          type: "subcategory",
          id: `subcategory-${subcategoryId}`,
          label: subcategory.name,
          subcategoryId,
        });
        break;
      }
    }
  }

  return pills;
}

export function buildCartLineId(
  productId: number,
  options: { color?: string; materials?: string; measures?: string }
) {
  return [
    productId,
    options.color ?? "",
    options.materials ?? "",
    options.measures ?? "",
  ].join("::");
}
