import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ProductDetail from "@/components/ProductDetail/ProductDetail";
import { api } from "@/lib/api";
import type { ProductDetailData } from "@/lib/productOptions";

export default function ProductoDetallePage() {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setNotFound(true);
      return;
    }

    api
      .getProduct(productId)
      .then((res) => setProduct(res.product))
      .catch(() => setNotFound(true));
  }, [productId]);

  if (notFound) {
    return <Navigate to="/productos" replace />;
  }

  if (!product) {
    return (
      <main>
        <p>Cargando producto...</p>
      </main>
    );
  }

  return (
    <main>
      <ProductDetail product={product} />
    </main>
  );
}
