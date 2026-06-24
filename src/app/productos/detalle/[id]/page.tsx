import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";

interface ProductoDetallePageProps {
  params: {
    id: string;
  };
}

export default async function ProductoDetallePage({
  params,
}: ProductoDetallePageProps) {
  const productId = Number(params.id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  return (
    <main>
      <p>
        <small>{product.category.name}</small>
      </p>
      <h1>{product.name}</h1>
      {product.caption && <p>{product.caption}</p>}

      {product.materials && (
        <p>
          <strong>Materiales:</strong> {product.materials}
        </p>
      )}
      {product.measures && (
        <p>
          <strong>Medidas:</strong> {product.measures}
        </p>
      )}
      {product.colors && (
        <p>
          <strong>Colores:</strong> {product.colors}
        </p>
      )}
      {product.details && (
        <p>
          <strong>Detalles:</strong> {product.details}
        </p>
      )}
      {product.tags && (
        <p>
          <strong>Tags:</strong> {product.tags}
        </p>
      )}

      <nav>
        <Link href="/productos">Volver al catálogo</Link>
        <Link href="/">Volver al inicio</Link>
      </nav>
    </main>
  );
}
