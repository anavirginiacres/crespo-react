import Link from "next/link";
import Image from "next/image";
import { getNewProducts } from "@/lib/products";
import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./NewProducts.module.scss";
import homeStyles from "./Home.module.scss";

const accents = ["pink", "blue", "yellow"] as const;

type NewProduct = Awaited<ReturnType<typeof getNewProducts>>[number];

function ProductBanner({
  product,
  variant,
  accent,
}: {
  product: NewProduct;
  variant: "featured" | "compact";
  accent: (typeof accents)[number];
}) {
  const imageSrc = product.image;

  return (
    <Link
      href={`/productos/detalle/${product.id}`}
      className={`${styles.banner} ${styles[`banner${variant === "featured" ? "Featured" : "Compact"}`]} ${styles[`accent${accent.charAt(0).toUpperCase()}${accent.slice(1)}`]}`}
    >
      <div className={styles.bannerMedia}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes={
              variant === "featured"
                ? "(max-width: 768px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, 30vw"
            }
            className={styles.bannerImage}
          />
        ) : (
          <div className={styles.bannerFallback}>
            <span className={styles.bannerFallbackLetter}>
              {product.name.charAt(0)}
            </span>
          </div>
        )}
        <div className={styles.bannerOverlay} />
        <span className={styles.bannerGlow} aria-hidden="true" />
      </div>

      <div className={styles.bannerContent}>
        <div className={styles.bannerMeta}>
          <span className={styles.bannerBadge}>Nuevo ingreso</span>
          <span className={styles.bannerCategory}>{product.category.name}</span>
        </div>
        <h3 className={styles.bannerTitle}>{product.name}</h3>
        {product.caption && (
          <p className={styles.bannerCaption}>{product.caption}</p>
        )}
        <span className={styles.bannerCta}>
          Ver producto
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default async function NewProducts() {
  const products = await getNewProducts(4);

  if (products.length === 0) {
    return null;
  }

  const [featured, ...rest] = products;

  return (
    <HomeSection id="novedades">
      <SectionHeader
        eyebrow="Novedades"
        title="Productos pensados para vos"
        description="Descubrí los últimos ingresos y llevá tu marca al siguiente nivel."
      />

      <div className={styles.showcase}>
        {featured && (
          <ProductBanner
            product={featured}
            variant="featured"
            accent={accents[0]}
          />
        )}

        {rest.length > 0 && (
          <div className={styles.bannerColumn}>
            {rest.map((product, index) => (
              <ProductBanner
                key={product.id}
                product={product}
                variant="compact"
                accent={accents[(index + 1) % accents.length]}
              />
            ))}
          </div>
        )}
      </div>

      <Link href="/productos" className={homeStyles.sectionLink}>
        Explorar todo el catálogo
      </Link>
    </HomeSection>
  );
}
