import type { Metadata } from "next";
import CartPage from "@/components/Cart/CartPage";

export const metadata: Metadata = {
  title: "Carrito | FF Crespo",
  description:
    "Revisá los productos de tu carrito y solicitá presupuesto por email o WhatsApp.",
};

export default function CarritoPage() {
  return (
    <main>
      <CartPage />
    </main>
  );
}
