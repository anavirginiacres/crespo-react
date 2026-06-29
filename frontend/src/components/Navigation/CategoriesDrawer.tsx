
import Link from "@/components/common/Link";
import type { CategoryNav } from "@/lib/categories";
import { buildCategoryProductosUrl } from "@/lib/slug";
import styles from "./Nav.module.scss";

type CategoriesDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryNav[];
};

export default function CategoriesDrawer({
  isOpen,
  onClose,
  categories,
}: CategoriesDrawerProps) {
  return (
    <>
      <div
        className={`${styles.drawerOverlay}${isOpen ? ` ${styles.drawerOverlayOpen}` : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`${styles.categoriesDrawer}${isOpen ? ` ${styles.categoriesDrawerOpen}` : ""}`}
        aria-hidden={!isOpen}
        aria-label="Categorías de productos"
      >
        <div className={styles.categoriesDrawerHeader}>
          <h2 className={styles.categoriesDrawerTitle}>Todos los Productos</h2>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={onClose}
            aria-label="Cerrar categorías"
          >
            ×
          </button>
        </div>

        <div className={styles.categoriesDrawerContent}>
          <Link href="/productos" className={styles.categoriesAllLink} onClick={onClose}>
            Ver catálogo completo
          </Link>

          <ul className={styles.categoriesList}>
            {categories.map((category) => (
              <li key={category.id} className={styles.categoryGroup}>
                <Link
                  href={buildCategoryProductosUrl(category.slug)}
                  className={styles.categoryLink}
                  onClick={onClose}
                >
                  {category.name}
                </Link>

                {category.subcategories.length > 0 && (
                  <ul className={styles.subcategoryList}>
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          href={buildCategoryProductosUrl(
                            category.slug,
                            subcategory.slug
                          )}
                          className={styles.subcategoryLink}
                          onClick={onClose}
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
