
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { useCart } from "@/context/CartContext";
import {
  buildProductGalleryImages,
  getDefaultOptionSelections,
  getProductOptionGroups,
  getProductQuantityOptions,
  parseQuantityOption,
  type ProductDetailData,
  type ProductOptionKey,
} from "@/lib/productOptions";
import { parseOptionList } from "@/lib/catalogUtils";
import logoRedondo from "@/styles/images/logo-redondo.png";
import styles from "./ProductDetail.module.scss";

type ProductDetailProps = {
  product: ProductDetailData;
};

function ImageFallback({ size = 48 }: { size?: number }) {
  return (
    <div className={styles.imageFallback}>
      <Image
        src={logoRedondo}
        alt=""
        width={size}
        height={size}
        className={styles.imageFallbackLogo}
        aria-hidden
      />
    </div>
  );
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(() => new Set());
  const [selections, setSelections] = useState<
    Partial<Record<ProductOptionKey, string>>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [quantitySelection, setQuantitySelection] = useState("");
  const [error, setError] = useState("");
  const [addedMessage, setAddedMessage] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const markImageFailed = useCallback((src: string) => {
    setFailedSrcs((current) => {
      if (current.has(src)) return current;
      const next = new Set(current);
      next.add(src);
      return next;
    });
  }, []);

  const optionGroups = useMemo(
    () => getProductOptionGroups(product),
    [product]
  );

  const quantityOptions = useMemo(
    () => getProductQuantityOptions(product.quantity),
    [product.quantity]
  );
  const hasQuantityOptions = quantityOptions.length > 0;

  const galleryImages = useMemo(
    () => buildProductGalleryImages(product),
    [product]
  );

  const activeImage = galleryImages[activeImageIndex];
  const hasGallery = galleryImages.length > 1;
  const canOpenGallery = galleryImages.length > 0;

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const openGallery = useCallback(() => {
    if (galleryImages.length === 0) return;
    setIsGalleryOpen(true);
  }, [galleryImages.length]);

  const showPreviousImage = useCallback(() => {
    setActiveImageIndex(
      (current) =>
        (current - 1 + galleryImages.length) % galleryImages.length
    );
  }, [galleryImages.length]);

  const showNextImage = useCallback(() => {
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
        return;
      }

      if (!hasGallery) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    isGalleryOpen,
    hasGallery,
    closeGallery,
    showPreviousImage,
    showNextImage,
  ]);

  useEffect(() => {
    galleryImages.forEach((image) => {
      const preload = new window.Image();
      preload.src = image.src;
    });
  }, [galleryImages]);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelections(getDefaultOptionSelections(optionGroups));

    if (hasQuantityOptions) {
      setQuantitySelection(quantityOptions[0]);
      setQuantity(parseQuantityOption(quantityOptions[0]));
    } else {
      setQuantitySelection("");
      setQuantity(1);
    }

    setError("");
    setAddedMessage("");
  }, [product.id, optionGroups, hasQuantityOptions, quantityOptions]);

  const infoItems = [
    ...(hasQuantityOptions
      ? []
      : [{ label: "Cantidad mínima", value: product.quantity }]),
    { label: "Detalles", value: product.details },
    { label: "A tener en cuenta", value: product.caution },
    { label: "Tiempo de entrega", value: product.delay },
  ].filter((item) => item.value?.trim());

  const tags = useMemo(() => parseOptionList(product.tags), [product.tags]);

  const handleAddToCart = () => {
    for (const group of optionGroups) {
      if (!selections[group.key]) {
        setError(`Seleccioná una opción de ${group.label.toLowerCase()}.`);
        return;
      }
    }

    addItem({
      productId: product.id,
      name: product.name,
      image: activeImage?.src ?? product.image ?? null,
      quantity,
      quantityOptions: hasQuantityOptions ? quantityOptions : undefined,
      options: {
        color: selections.color,
        materials: selections.materials,
        measures: selections.measures,
        details: product.details ?? undefined,
      },
    });

    setError("");
    setAddedMessage("Producto agregado al carrito.");
    window.setTimeout(() => setAddedMessage(""), 3000);
  };

  return (
    <div className={styles.detail}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/productos">Catálogo</Link>
        <span aria-hidden="true">/</span>
        <span>{product.category.name}</span>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <header className={styles.header}>
        <p className={styles.eyebrow}>
          {product.category.name} · {product.subcategory.name}
        </p>
        <h1 className={styles.title}>{product.name}</h1>
        {product.caption && <p className={styles.caption}>{product.caption}</p>}
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.mediaColumn}>
          <div
            className={`${styles.mainImageWrap}${
              canOpenGallery ? ` ${styles.mainImageWrapInteractive}` : ""
            }`}
            role={canOpenGallery ? "button" : undefined}
            tabIndex={canOpenGallery ? 0 : undefined}
            aria-label={
              canOpenGallery ? `Ver ${product.name} en pantalla completa` : undefined
            }
            onClick={canOpenGallery ? openGallery : undefined}
            onKeyDown={
              canOpenGallery
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openGallery();
                    }
                  }
                : undefined
            }
          >
            {galleryImages.length === 0 ? (
              <ImageFallback />
            ) : (
              galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`${styles.mainImageSlide}${
                    index === activeImageIndex
                      ? ` ${styles.mainImageSlideActive}`
                      : ""
                  }`}
                  aria-hidden={index !== activeImageIndex}
                >
                  {failedSrcs.has(image.src) ? (
                    <ImageFallback />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt={index === activeImageIndex ? product.name : ""}
                      className={styles.mainImage}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      onError={() => markImageFailed(image.src)}
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {hasGallery && (
            <div className={styles.thumbnailRow}>
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={`${styles.thumbnailButton}${
                    index === activeImageIndex
                      ? ` ${styles.thumbnailButtonActive}`
                      : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-pressed={index === activeImageIndex}
                >
                  {failedSrcs.has(image.src) ? (
                    <ImageFallback size={24} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt=""
                      className={styles.thumbnailImage}
                      loading="lazy"
                      decoding="async"
                      onError={() => markImageFailed(image.src)}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoColumn}>
          <p className={styles.price}>Consultar precio</p>

          {(infoItems.length > 0 || tags.length > 0) && (
            <dl className={styles.infoList}>
              {infoItems.map((item) => (
                <div key={item.label} className={styles.infoItem}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}

              {tags.length > 0 && (
                <div className={styles.infoItem}>
                  <dd className={styles.tagList}>
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/productos?q=${encodeURIComponent(tag)}`}
                        className={styles.tagLink}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {optionGroups.map((group) => (
            <fieldset key={group.key} className={styles.optionGroup}>
              <legend className={styles.optionLegend}>{group.label}</legend>
              <div className={styles.optionList}>
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.optionPill}${
                      selections[group.key] === option
                        ? ` ${styles.optionPillActive}`
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
          ))}

          <div className={styles.quantityRow}>
            <label
              htmlFor={hasQuantityOptions ? "product-quantity" : undefined}
              className={styles.optionLegend}
            >
              Cantidad
            </label>
            {hasQuantityOptions ? (
              <select
                id="product-quantity"
                className={styles.quantitySelect}
                value={quantitySelection}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuantitySelection(value);
                  setQuantity(parseQuantityOption(value));
                }}
              >
                {quantityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
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
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {addedMessage && <p className={styles.success}>{addedMessage}</p>}

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {isGalleryOpen &&
        activeImage &&
        createPortal(
          <div
            className={styles.galleryOverlay}
            onClick={closeGallery}
            aria-hidden={false}
          >
            <div
              className={styles.galleryDialog}
              role="dialog"
              aria-modal="true"
              aria-label={`Galería de ${product.name}`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={styles.galleryClose}
                onClick={closeGallery}
                aria-label="Cerrar galería"
              >
                ×
              </button>

              {hasGallery && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                    onClick={showPreviousImage}
                    aria-label="Imagen anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                    onClick={showNextImage}
                    aria-label="Imagen siguiente"
                  >
                    ›
                  </button>
                </>
              )}

              <div className={styles.galleryImageFrame}>
                {failedSrcs.has(activeImage.src) ? (
                  <ImageFallback size={64} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeImage.src}
                    alt={`${product.name} — imagen ${activeImageIndex + 1}`}
                    className={styles.galleryModalImage}
                    decoding="async"
                    draggable={false}
                    onError={() => markImageFailed(activeImage.src)}
                  />
                )}
              </div>

              {hasGallery && (
                <p className={styles.galleryCounter} aria-live="polite">
                  {activeImageIndex + 1} / {galleryImages.length}
                </p>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* {hasGallery && (
        <section className={styles.gallerySection} aria-label="Galería de imágenes">
          <h2 className={styles.galleryTitle}>Galería del producto</h2>
          <p className={styles.galleryDescription}>
            Más imágenes de trabajos realizados sobre este producto.
          </p>
          <div className={styles.galleryGrid}>
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={`${styles.galleryItem}${
                  index === activeImageIndex ? ` ${styles.galleryItemActive}` : ""
                }`}
                onClick={() => {
                  setActiveImageIndex(index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                aria-label={`Ver imagen ${index + 1} como principal`}
              >
                <ProductImage
                  src={image.src}
                  alt={`${product.name} — imagen ${index + 1}`}
                  className={styles.galleryImage}
                />
              </button>
            ))}
          </div>
        </section>
      )} */}
    </div>
  );
}
