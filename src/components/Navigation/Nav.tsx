import { getCategories } from "@/lib/categories";
import { getProductQuantityOptionsMap } from "@/lib/products";
import NavBar from "./NavBar";

export default async function Nav() {
  const [categories, quantityOptionsByProductId] = await Promise.all([
    getCategories(),
    getProductQuantityOptionsMap(),
  ]);

  return (
    <NavBar
      categories={categories}
      quantityOptionsByProductId={quantityOptionsByProductId}
    />
  );
}
