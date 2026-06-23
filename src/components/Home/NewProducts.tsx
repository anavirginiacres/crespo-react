import Link from "next/link";
import Image from "next/image";
import { getNewProducts } from "@/lib/products";
import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";

export default async function NewProducts() {
  const products = await getNewProducts(4);

  return (
    <HomeSection id="novedades">
      <SectionHeader
        eyebrow="Novedades"
        title="Productos nuevos"
        description="Descubrí lo último en diseño gráfico, textil y producción personalizada."
      />

      {products.length === 0 ? (
        <p className={styles.sectionDescription}>
          Pronto agregaremos nuevos productos al catálogo.
        </p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.id}`}
              className={styles.productCard}
            >
              <div className={styles.productImageWrap}>
                {product.images[0]?.src ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    width={400}
                    height={300}
                    className={styles.productImage}
                  />
                ) : (
                  <span className={styles.productPlaceholder}>
                    {product.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className={styles.productBody}>
                <span className={styles.productBadge}>Nuevo</span>
                <h3 className={styles.productName}>{product.name}</h3>
                {product.caption && (
                  <p className={styles.productCaption}>{product.caption}</p>
                )}
                <p className={styles.productCategory}>{product.category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link href="/productos" className={styles.sectionLink}>
        Ver todo el catálogo
      </Link>
    </HomeSection>
  );
}
