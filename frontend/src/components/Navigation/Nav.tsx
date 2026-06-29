import { useEffect, useState } from "react";
import { api, type CategoryNav } from "@/lib/api";
import NavBar from "./NavBar";

export default function Nav() {
  const [categories, setCategories] = useState<CategoryNav[]>([]);
  const [quantityOptionsByProductId, setQuantityOptionsByProductId] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    Promise.all([api.getCategories(), api.getQuantityOptionsMap()])
      .then(([categoriesRes, quantityRes]) => {
        setCategories(categoriesRes.categories);
        setQuantityOptionsByProductId(quantityRes.map);
      })
      .catch(() => {
        setCategories([]);
        setQuantityOptionsByProductId({});
      });
  }, []);

  return (
    <NavBar
      categories={categories}
      quantityOptionsByProductId={quantityOptionsByProductId}
    />
  );
}
