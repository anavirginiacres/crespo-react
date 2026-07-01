
import { useState } from "react";
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
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<number>>(
    () => new Set()
  );

  const toggleCategoryDropdown = (categoryId: number) => {
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

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
            {categories.map((category) => {
              const hasSubcategories = category.subcategories.length > 0;
              const isExpanded = expandedCategoryIds.has(category.id);

              return (
              <li key={category.id} className={styles.categoryGroup}>
                <div className={styles.categoryGroupHeader}>
                  <Link
                    href={buildCategoryProductosUrl(category.slug)}
                    className={styles.categoryLink}
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>

                  {hasSubcategories && (
                    <button
                      type="button"
                      className={styles.categoryDropdownToggle}
                      aria-expanded={isExpanded}
                      aria-controls={`drawer-subcategories-${category.id}`}
                      aria-label={`${isExpanded ? "Ocultar" : "Mostrar"} subcategorías de ${category.name}`}
                      onClick={() => toggleCategoryDropdown(category.id)}
                    >
                      <span
                        className={`${styles.categoryDropdownIcon}${
                          isExpanded ? ` ${styles.categoryDropdownIconOpen}` : ""
                        }`}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </button>
                  )}
                </div>

                {hasSubcategories && isExpanded && (
                  <ul
                    id={`drawer-subcategories-${category.id}`}
                    className={styles.subcategoryList}
                  >
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
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
