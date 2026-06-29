import LayoutChrome from "@/components/LayoutChrome";
import Nav from "@/components/Navigation/Nav";
import NotFoundContent from "@/components/NotFound/NotFoundContent";
import { CartProvider } from "@/context/CartContext";

export default function NotFoundPage() {
  return (
    <CartProvider>
      <LayoutChrome nav={<Nav />}>
        <NotFoundContent />
      </LayoutChrome>
    </CartProvider>
  );
}
