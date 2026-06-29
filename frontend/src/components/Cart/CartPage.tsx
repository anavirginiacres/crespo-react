
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { useCart } from "@/context/CartContext";
import CartLineQuantity from "@/components/Cart/CartLineQuantity";
import QuoteContactModal from "@/components/Cart/QuoteContactModal";
import { getLineQuantityOptions } from "@/components/Cart/cartQuantityUtils";
import { WHATSAPP_CONTACTS } from "@/lib/contact";
import type { ProductQuantityOptionsMap } from "@/lib/products";
import {
  getClientContact,
  isValidClientContact,
  saveClientContact,
  type ClientContact,
} from "@/lib/clientContact";
import {
  buildQuoteMailtoUrl,
  buildQuoteWhatsAppUrl,
  formatCartQuoteMessage,
  type QuoteAction,
} from "@/lib/cartQuote";
import logoRedondo from "@/styles/images/logo-redondo.png";
import styles from "./CartPage.module.scss";

const CART_EMPTY_LOGO_SIZE = 64;

function CartItemThumbnail({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !src || imageError;

  if (showFallback) {
    return (
      <div className={styles.itemPlaceholder}>
        <Image
          src={logoRedondo}
          alt=""
          width={32}
          height={32}
          className={styles.itemPlaceholderLogo}
          aria-hidden
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={styles.itemImage}
      loading="lazy"
      decoding="async"
      onError={() => setImageError(true)}
    />
  );
}

function CartItemMeta({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value?.trim()) return null;

  return (
    <li className={styles.itemMeta}>
      <strong>{label}:</strong> {value}
    </li>
  );
}

type CartPageProps = {
  quantityOptionsByProductId?: ProductQuantityOptionsMap;
};

export default function CartPage({
  quantityOptionsByProductId = {},
}: CartPageProps) {
  const { items, removeItem, updateQuantity, clearCart, totalItems } =
    useCart();
  const [mounted, setMounted] = useState(false);
  const [clientContact, setClientContact] = useState<ClientContact | null>(
    null
  );
  const [pendingQuoteAction, setPendingQuoteAction] =
    useState<QuoteAction | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setClientContact(getClientContact());
  }, []);

  const executeQuoteAction = useCallback(
    (action: QuoteAction, contact: ClientContact) => {
      if (action === "email") {
        window.location.href = buildQuoteMailtoUrl(items, contact);
        return;
      }

      const phone =
        action === "whatsapp-grafica"
          ? WHATSAPP_CONTACTS.grafica.phone
          : WHATSAPP_CONTACTS.textil.phone;

      window.open(buildQuoteWhatsAppUrl(items, phone, contact), "_blank");
    },
    [items]
  );

  const handleQuoteRequest = useCallback(
    (action: QuoteAction) => {
      const contact = clientContact ?? getClientContact();

      if (isValidClientContact(contact)) {
        executeQuoteAction(action, contact);
        return;
      }

      setPendingQuoteAction(action);
      setIsContactModalOpen(true);
    },
    [clientContact, executeQuoteAction]
  );

  const handleContactSubmit = useCallback(
    (contact: ClientContact) => {
      saveClientContact(contact);
      setClientContact(contact);
      setIsContactModalOpen(false);

      if (pendingQuoteAction) {
        executeQuoteAction(pendingQuoteAction, contact);
        setPendingQuoteAction(null);
      }
    },
    [executeQuoteAction, pendingQuoteAction]
  );

  const handleContactModalClose = useCallback(() => {
    setIsContactModalOpen(false);
    setPendingQuoteAction(null);
  }, []);

  const quoteMessage = useMemo(
    () => formatCartQuoteMessage(items, clientContact),
    [items, clientContact]
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Presupuesto</p>
          <h1 className={styles.title}>Mi carrito</h1>
          <p className={styles.description}>
            Revisá los productos seleccionados y enviá tu consulta con un solo
            clic. El detalle del carrito se incluirá automáticamente en el
            mensaje.
          </p>
        </div>
        {items.length > 0 && (
          <p className={styles.summary}>
            {totalItems} {totalItems === 1 ? "producto" : "productos"}
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <Image
            src={logoRedondo}
            alt="FF Crespo"
            width={CART_EMPTY_LOGO_SIZE}
            height={CART_EMPTY_LOGO_SIZE}
            className={styles.emptyLogo}
          />
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyText}>
            Agregá productos desde el catálogo para armar tu consulta de
            presupuesto.
          </p>
          <Link href="/productos" className={styles.quoteButton}>
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          <ul className={styles.itemList}>
            {items.map((item) => {
              const lineQuantityOptions = getLineQuantityOptions(
                item,
                quantityOptionsByProductId
              );

              return (
              <li key={item.lineId} className={styles.item}>
                <div className={styles.itemMedia}>
                  <CartItemThumbnail src={item.image} alt={item.name} />
                </div>

                <div className={styles.itemBody}>
                  <h2 className={styles.itemName}>
                    <Link href={`/productos/detalle/${item.productId}`}>
                      {item.name}
                    </Link>
                  </h2>

                  <ul className={styles.itemMetaList}>
                    <CartItemMeta label="Color" value={item.options.color} />
                    <CartItemMeta label="Material" value={item.options.materials} />
                    <CartItemMeta label="Medida" value={item.options.measures} />
                  </ul>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityField}>
                    <span className={styles.quantityLabel}>Cantidad</span>
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
                    className={styles.removeButton}
                    onClick={() => removeItem(item.lineId)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
              );
            })}
          </ul>

          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </div>

          <section className={styles.quoteSection} aria-labelledby="quote-title">
            <div className={styles.quoteHeader}>
              <h2 id="quote-title" className={styles.quoteTitle}>
                Solicitar presupuesto
              </h2>
              <p className={styles.quoteDescription}>
                Elegí cómo querés contactarnos. El mensaje incluirá el listado
                completo de productos, cantidades, variantes y observaciones.
              </p>
            </div>

            <pre className={styles.quotePreview}>{quoteMessage}</pre>

            <div className={styles.quoteActions}>
              <button
                type="button"
                className={styles.quoteButton}
                onClick={() => handleQuoteRequest("email")}
              >
                Enviar por email
              </button>
              <button
                type="button"
                className={`${styles.quoteButton} ${styles.quoteButtonWhatsapp}`}
                onClick={() => handleQuoteRequest("whatsapp-grafica")}
              >
                WhatsApp Gráfica
              </button>
              <button
                type="button"
                className={`${styles.quoteButton} ${styles.quoteButtonWhatsapp}`}
                onClick={() => handleQuoteRequest("whatsapp-textil")}
              >
                WhatsApp Textil
              </button>
            </div>
          </section>

          <QuoteContactModal
            isOpen={isContactModalOpen}
            initialContact={clientContact ?? undefined}
            onClose={handleContactModalClose}
            onSubmit={handleContactSubmit}
          />
        </>
      )}

      <Link href="/productos" className={styles.backLink}>
        ← Seguir comprando
      </Link>
    </div>
  );
}
