import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router";
import ProductCatalog from "@/components/ProductCatalog/ProductCatalog";
import { api, type CategoryNav } from "@/lib/api";
import type { CatalogProduct } from "@/lib/catalogUtils";
import { resolveCatalogFilters } from "@/lib/catalogFilters";

export default function ProductosPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CategoryNav[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.products);
        setCategories(categoriesRes.categories);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const initialFilters = resolveCatalogFilters(categories, searchParams);
  const catalogKey = initialFilters.catalogKey;

  if (isLoading) {
    return (
      <main>
        <p>Cargando catálogo...</p>
      </main>
    );
  }

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
