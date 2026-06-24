"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_CONTACTS } from "@/lib/contact";
import {
  buildQuoteMailtoUrl,
  buildQuoteWhatsAppUrl,
  formatCartQuoteMessage,
} from "@/lib/cartQuote";
import logoHeader from "@/styles/images/logo-original.png";
import logoRedondo from "@/styles/images/logo-redondo.png";
import styles from "./CartPage.module.scss";

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

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quoteMessage = useMemo(() => formatCartQuoteMessage(items), [items]);
  const emailQuoteUrl = useMemo(() => buildQuoteMailtoUrl(items), [items]);
  const whatsappGraficaUrl = useMemo(
    () => buildQuoteWhatsAppUrl(items, WHATSAPP_CONTACTS.grafica.phone),
    [items]
  );
  const whatsappTextilUrl = useMemo(
    () => buildQuoteWhatsAppUrl(items, WHATSAPP_CONTACTS.textil.phone),
    [items]
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
            src={logoHeader}
            alt="FF Crespo"
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
            {items.map((item) => (
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
                    <CartItemMeta label="Cantidad" value={String(item.quantity)} />
                    <CartItemMeta label="Color" value={item.options.color} />
                    <CartItemMeta label="Material" value={item.options.materials} />
                    <CartItemMeta label="Medida" value={item.options.measures} />
                    <CartItemMeta
                      label="Observaciones"
                      value={item.options.details}
                    />
                  </ul>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControls}>
                    <button
                      type="button"
                      className={styles.quantityButton}
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity - 1)
                      }
                      aria-label={`Disminuir cantidad de ${item.name}`}
                    >
                      −
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      type="button"
                      className={styles.quantityButton}
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity + 1)
                      }
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      +
                    </button>
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
            ))}
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
              <a href={emailQuoteUrl} className={styles.quoteButton}>
                Enviar por email
              </a>
              <a
                href={whatsappGraficaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.quoteButton} ${styles.quoteButtonWhatsapp}`}
              >
                WhatsApp Gráfica
              </a>
              <a
                href={whatsappTextilUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.quoteButton} ${styles.quoteButtonWhatsapp}`}
              >
                WhatsApp Textil
              </a>
            </div>
          </section>
        </>
      )}

      <Link href="/productos" className={styles.backLink}>
        ← Seguir comprando
      </Link>
    </div>
  );
}
