import { useEffect, useState } from "react";
import CartPage from "@/components/Cart/CartPage";
import { api } from "@/lib/api";

export default function CarritoPage() {
  const [quantityOptionsByProductId, setQuantityOptionsByProductId] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    api
      .getQuantityOptionsMap()
      .then((res) => setQuantityOptionsByProductId(res.map))
      .catch(() => setQuantityOptionsByProductId({}));
  }, []);

  return (
    <main>
      <CartPage quantityOptionsByProductId={quantityOptionsByProductId} />
    </main>
  );
}
