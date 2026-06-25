import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail/ProductDetail";
import { getProductById } from "@/lib/products";
import type { ProductDetailData } from "@/lib/productOptions";

interface ProductoDetallePageProps {
  params: {
    id: string;
  };
}

function mapProductDetail(
  product: NonNullable<Awaited<ReturnType<typeof getProductById>>>
): ProductDetailData {
  return {
    id: product.id,
    name: product.name,
    caption: product.caption,
    image: product.image,
    colors: product.colors,
    materials: product.materials,
    measures: product.measures,
    quantity: product.quantity,
    details: product.details,
    caution: product.caution,
    delay: product.delay,
    tags: product.tags,
    category: { name: product.category.name },
    subcategory: { name: product.subcategory.name },
    images: product.images.map((image) => ({
      id: image.id,
      src: image.src,
    })),
  };
}

export async function generateMetadata({
  params,
}: ProductoDetallePageProps): Promise<Metadata> {
  const productId = Number(params.id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return { title: "Producto no encontrado" };
  }

  const product = await getProductById(productId);
  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: `${product.name} | FF Crespo`,
    description: product.caption ?? `Detalle de ${product.name}`,
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
      <ProductDetail product={mapProductDetail(product)} />
    </main>
  );
}
