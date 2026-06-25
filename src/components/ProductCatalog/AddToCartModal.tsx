"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { CatalogProduct } from "@/lib/catalogUtils";
import { parseOptionList } from "@/lib/catalogUtils";
import { getDefaultOptionSelections } from "@/lib/productOptions";
import styles from "./ProductCatalog.module.scss";

type CartConfirmPayload = {
  productId: number;
  name: string;
  image?: string | null;
  quantity: number;
  options: {
    color?: string;
    materials?: string;
    measures?: string;
    details?: string;
  };
};

type AddToCartModalProps = {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: CartConfirmPayload) => void;
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
  onConfirm,
}: AddToCartModalProps) {
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

    setSelections(getDefaultOptionSelections(optionGroups));
    setQuantity(1);
    setError("");
  }, [isOpen, product?.id, optionGroups]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
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

    onConfirm({
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
  };

  return createPortal(
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
    </div>,
    document.body
  );
}
