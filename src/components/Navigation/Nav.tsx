import { getCategories } from "@/lib/categories";
import NavBar from "./NavBar";

export default async function Nav() {
  const categories = await getCategories();

  return <NavBar categories={categories} />;
}
