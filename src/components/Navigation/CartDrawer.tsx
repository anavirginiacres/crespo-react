"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import logoHeader from "@/styles/images/logo-original.png";
import styles from "./Nav.module.scss";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems } = useCart();

  return (
    <>
      <div
        className={`${styles.drawerOverlay}${isOpen ? ` ${styles.drawerOverlayOpen}` : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`${styles.cartDrawer}${isOpen ? ` ${styles.cartDrawerOpen}` : ""}`}
        aria-hidden={!isOpen}
        aria-label="Carrito de compras"
      >
        <div className={styles.cartDrawerHeader}>
          <h2 className={styles.cartDrawerTitle}>Mi Carrito</h2>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.cartEmpty}>
            <Image
              src={logoHeader}
              alt="FF Crespo"
              className={styles.cartEmptyLogo}
            />
            <p className={styles.cartEmptyText}>Tu carrito aún está vacío</p>
            <p className={styles.cartEmptyHint}>
              Busca un producto en la barra o visita nuestro{" "}
              <Link href="/productos" onClick={onClose}>
                Catálogo
              </Link>
            </p>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <ul className={styles.cartList}>
              {items.map((item) => (
                <li key={item.lineId} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <span className={styles.cartItemName}>{item.name}</span>
                    {(item.options.color ||
                      item.options.materials ||
                      item.options.measures) && (
                      <span className={styles.cartItemMeta}>
                        {[
                          item.options.color,
                          item.options.materials,
                          item.options.measures,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                    <span className={styles.cartItemQuantity}>
                      Cantidad: {item.quantity}
                    </span>
                  </div>
                  <div className={styles.cartItemActions}>
                    <button
                      type="button"
                      className={styles.cartQtyButton}
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity - 1)
                      }
                      aria-label={`Disminuir cantidad de ${item.name}`}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className={styles.cartQtyButton}
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity + 1)
                      }
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={styles.cartRemoveButton}
                      onClick={() => removeItem(item.lineId)}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.cartFooter}>
              <p className={styles.cartTotal}>
                {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </p>
              <Link
                href="/carrito"
                className={styles.cartViewLink}
                onClick={onClose}
              >
                Ver carrito completo
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
