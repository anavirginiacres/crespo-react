"use client";

import type { CartItem } from "@/context/CartContext";
import {
  findQuantityOptionSelection,
  parseQuantityOption,
} from "@/lib/productOptions";
import styles from "./CartLineQuantity.module.scss";

type CartLineQuantityProps = {
  item: CartItem;
  quantityOptions: string[];
  onUpdate: (quantity: number) => void;
};

export default function CartLineQuantity({
  item,
  quantityOptions,
  onUpdate,
}: CartLineQuantityProps) {
  const hasQuantityOptions = quantityOptions.length > 0;
  const selection = findQuantityOptionSelection(quantityOptions, item.quantity);

  if (hasQuantityOptions) {
    return (
      <select
        className={styles.select}
        value={selection}
        aria-label={`Cantidad de ${item.name}`}
        onChange={(event) => onUpdate(parseQuantityOption(event.target.value))}
      >
        {quantityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onUpdate(item.quantity - 1)}
        aria-label={`Disminuir cantidad de ${item.name}`}
      >
        −
      </button>
      <span className={styles.value}>{item.quantity}</span>
      <button
        type="button"
        className={styles.button}
        onClick={() => onUpdate(item.quantity + 1)}
        aria-label={`Aumentar cantidad de ${item.name}`}
      >
        +
      </button>
    </div>
  );
}
