import type { CartItem } from "@/context/CartContext";
import type { ProductQuantityOptionsMap } from "@/lib/products";

export function getLineQuantityOptions(
  item: CartItem,
  quantityOptionsByProductId: ProductQuantityOptionsMap
): string[] {
  if (item.quantityOptions?.length) return item.quantityOptions;
  return quantityOptionsByProductId[item.productId] ?? [];
}
