import Link from "@/components/common/Link";
import { HomeSection } from "./HomeSection";
import styles from "./Home.module.scss";

export default function CatalogCta() {
  return (
    <HomeSection variant="gradient">
      <div className={styles.ctaBanner}>
        <div>
          <h2 className={styles.ctaTitle}>
            ¿Listo para empezar tu proyecto?
          </h2>
          <p className={styles.ctaText}>
            Explorá nuestro catálogo completo y encontrá el producto ideal para
            tu marca, evento o negocio.
          </p>
        </div>
        <Link href="/productos" className={styles.ctaButton}>
          Visitar catálogo
        </Link>
      </div>
    </HomeSection>
  );
}
