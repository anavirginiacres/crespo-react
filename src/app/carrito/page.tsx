import type { Metadata } from "next";
import { getProductQuantityOptionsMap } from "@/lib/products";
import CartPage from "@/components/Cart/CartPage";

export const metadata: Metadata = {
  title: "Carrito | FF Crespo",
  description:
    "Revisá los productos de tu carrito y solicitá presupuesto por email o WhatsApp.",
};

export default async function CarritoPage() {
  const quantityOptionsByProductId = await getProductQuantityOptionsMap();

  return (
    <main>
      <CartPage quantityOptionsByProductId={quantityOptionsByProductId} />
    </main>
  );
}
