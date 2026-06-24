import { getCategories, getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categories";
import { getCatalogProducts } from "@/lib/products";
import ProductCatalog from "@/components/ProductCatalog/ProductCatalog";

interface ProductosPageProps {
  searchParams: {
    q?: string;
    categoria?: string;
    subcategoria?: string;
  };
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const categorySlug = searchParams.categoria?.trim() ?? "";
  const subcategorySlug = searchParams.subcategoria?.trim() ?? "";

  const [products, categories, category, subcategory] = await Promise.all([
    getCatalogProducts(),
    getCategories(),
    categorySlug ? getCategoryBySlug(categorySlug) : null,
    categorySlug && subcategorySlug
      ? getSubcategoryBySlug(categorySlug, subcategorySlug)
      : null,
  ]);

  const initialFilters = {
    search: query,
    categoryIds: subcategory ? [] : category ? [category.id] : [],
    subcategoryIds: subcategory ? [subcategory.id] : [],
    sort: "asc" as const,
  };

  const catalogKey = `${query}|${category?.id ?? ""}|${subcategory?.id ?? ""}`;

  return (
    <main>
      <ProductCatalog
        key={catalogKey}
        products={products}
        categories={categories}
        initialFilters={initialFilters}
      />
    </main>
  );
}
