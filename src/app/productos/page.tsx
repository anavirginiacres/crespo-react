import Link from "next/link";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categories";
import { getProducts } from "@/lib/products";

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

  const [category, subcategory] = await Promise.all([
    categorySlug ? getCategoryBySlug(categorySlug) : null,
    categorySlug && subcategorySlug
      ? getSubcategoryBySlug(categorySlug, subcategorySlug)
      : null,
  ]);

  const products = await getProducts({
    q: query,
    categoria: category?.id,
    subcategoria: subcategory?.id,
  });

  let title = "Catálogo";
  if (query) {
    title = "Resultados de búsqueda";
  } else if (subcategory) {
    title = subcategory.name;
  } else if (category) {
    title = category.name;
  }

  const hasFilters = Boolean(query || categorySlug || subcategorySlug);
  const hasInvalidFilter =
    (categorySlug && !category) ||
    (subcategorySlug && !subcategory);

  return (
    <main>
      <h1>{title}</h1>

      {hasInvalidFilter ? (
        <p>No encontramos la categoría solicitada.</p>
      ) : query ? (
        <p>
          {products.length}{" "}
          {products.length === 1 ? "resultado" : "resultados"} para &ldquo;
          {query}&rdquo;
        </p>
      ) : subcategory ? (
        <p>
          Productos en {subcategory.category.name} / {subcategory.name}
        </p>
      ) : category ? (
        <p>Productos en {category.name}</p>
      ) : (
        <p>Explorá nuestro catálogo de productos.</p>
      )}

      {hasFilters && !hasInvalidFilter && products.length === 0 && (
        <p>No encontramos productos con los filtros seleccionados.</p>
      )}

      {products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/productos/${product.id}`}>{product.name}</Link>
              {product.caption && <span> — {product.caption}</span>}
              {product.tags && (
                <span>
                  {" "}
                  <small>({product.tags})</small>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <nav>
        {hasFilters && <Link href="/productos">Ver catálogo completo</Link>}
        <Link href="/">Volver al inicio</Link>
      </nav>
    </main>
  );
}
