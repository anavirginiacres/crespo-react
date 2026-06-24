"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CatalogProduct } from "@/lib/catalogUtils";
import logoRedondo from "@/styles/images/logo-redondo.png";
import styles from "./ProductCatalog.module.scss";

type ProductCardProps = {
  product: CatalogProduct;
  onAddToCart: (product: CatalogProduct) => void;
};

function CardImageFallback() {
  return (
    <div className={styles.cardPlaceholder}>
      <Image
        src={logoRedondo}
        alt=""
        width={32}
        height={32}
        className={styles.cardPlaceholderLogo}
        aria-hidden
      />
    </div>
  );
}

export default memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const imageSrc = product.images[0]?.src;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product.id, imageSrc]);

  const showFallback = !imageSrc || imageError;

  return (
    <article className={styles.card}>
      <Link
        href={`/productos/detalle/${product.id}`}
        className={styles.cardMediaLink}
      >
        <div className={styles.cardMedia}>
          {showFallback ? (
            <CardImageFallback />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={product.name}
              className={styles.cardImage}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </Link>

      <div className={styles.cardBody}>
        <p className={styles.cardCategory}>
          {product.category.name} · {product.subcategory.name}
        </p>
        <h2 className={styles.cardTitle}>
          <Link href={`/productos/detalle/${product.id}`}>{product.name}</Link>
        </h2>
        {product.caption && (
          <p className={styles.cardCaption}>{product.caption}</p>
        )}
        <p className={styles.cardPrice}>Consultar precio</p>

        <div className={styles.cardActions}>
          <Link
            href={`/productos/detalle/${product.id}`}
            className={styles.secondaryButton}
          >
            Ver detalle
          </Link>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onAddToCart(product)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
});
