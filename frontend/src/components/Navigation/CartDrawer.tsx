
import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { useEffect } from "react";
import CartLineQuantity from "@/components/Cart/CartLineQuantity";
import { getLineQuantityOptions } from "@/components/Cart/cartQuantityUtils";
import { useCart } from "@/context/CartContext";
import type { ProductQuantityOptionsMap } from "@/lib/products";
import logoRedondo from "@/styles/images/logo-redondo.png";
import styles from "./Nav.module.scss";

const CART_EMPTY_LOGO_SIZE = 64;

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  quantityOptionsByProductId?: ProductQuantityOptionsMap;
};

export default function CartDrawer({
  isOpen,
  onClose,
  quantityOptionsByProductId = {},
}: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();

  useEffect(() => {
    const preload = new window.Image();
    preload.src = logoRedondo;
  }, []);

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
              src={logoRedondo}
              alt="FF Crespo"
              width={CART_EMPTY_LOGO_SIZE}
              height={CART_EMPTY_LOGO_SIZE}
              className={styles.cartEmptyLogo}
            />
            <p className={styles.cartEmptyText}>Tu carrito está vacío</p>
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
              {items.map((item) => {
                const lineQuantityOptions = getLineQuantityOptions(
                  item,
                  quantityOptionsByProductId
                );

                return (
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
                    </div>
                    <div className={styles.cartItemActions}>
                      <div className={styles.cartItemQuantityRow}>
                        <span className={styles.cartItemQuantityLabel}>
                          Cantidad
                        </span>
                        <CartLineQuantity
                          item={item}
                          quantityOptions={lineQuantityOptions}
                          onUpdate={(quantity) =>
                            updateQuantity(item.lineId, quantity)
                          }
                        />
                      </div>
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
                );
              })}
            </ul>

            <div className={styles.cartFooter}>
              <p className={styles.cartTotal}>
                {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </p>
              <button
                type="button"
                className={styles.cartClearButton}
                onClick={clearCart}
              >
                Vaciar carrito
              </button>
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
