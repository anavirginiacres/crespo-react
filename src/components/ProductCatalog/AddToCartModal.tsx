"use client";

import { useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalogUtils";
import { parseOptionList } from "@/lib/catalogUtils";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCatalog.module.scss";

type AddToCartModalProps = {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
};

type OptionGroup = {
  key: "color" | "materials" | "measures";
  label: string;
  options: string[];
};

export default function AddToCartModal({
  product,
  isOpen,
  onClose,
}: AddToCartModalProps) {
  const { addItem } = useCart();
  const [selections, setSelections] = useState<
    Partial<Record<OptionGroup["key"], string>>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const optionGroups = useMemo<OptionGroup[]>(() => {
    if (!product) return [];

    return [
      { key: "color", label: "Color", options: parseOptionList(product.colors) },
      {
        key: "materials",
        label: "Material",
        options: parseOptionList(product.materials),
      },
      {
        key: "measures",
        label: "Medida",
        options: parseOptionList(product.measures),
      },
    ].filter((group) => group.options.length > 0);
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;

    setSelections({});
    setQuantity(1);
    setError("");
  }, [isOpen, product?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const imageSrc = product.images[0]?.src;

  const handleConfirm = () => {
    for (const group of optionGroups) {
      if (!selections[group.key]) {
        setError(`Seleccioná una opción de ${group.label.toLowerCase()}.`);
        return;
      }
    }

    addItem({
      productId: product.id,
      name: product.name,
      image: imageSrc ?? null,
      quantity,
      options: {
        color: selections.color,
        materials: selections.materials,
        measures: selections.measures,
        details: product.details ?? undefined,
      },
    });

    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 id="add-to-cart-title" className={styles.modalTitle}>
          Agregar al carrito
        </h2>
        <p className={styles.modalProductName}>{product.name}</p>

        {optionGroups.length === 0 ? (
          <p className={styles.modalHint}>
            Este producto no tiene variantes configuradas. Podés confirmar la
            cantidad y agregarlo al carrito.
          </p>
        ) : (
          optionGroups.map((group) => (
            <fieldset key={group.key} className={styles.optionGroup}>
              <legend className={styles.optionLegend}>{group.label}</legend>
              <div className={styles.optionList}>
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.optionButton}${
                      selections[group.key] === option
                        ? ` ${styles.optionButtonActive}`
                        : ""
                    }`}
                    onClick={() => {
                      setSelections((current) => ({
                        ...current,
                        [group.key]: option,
                      }));
                      setError("");
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          ))
        )}

        <div className={styles.quantityRow}>
          <span className={styles.optionLegend}>Cantidad</span>
          <div className={styles.quantityControls}>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => setQuantity((value) => value + 1)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
