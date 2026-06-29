
import { Suspense, useEffect, useState } from "react";
import Link from "@/components/common/Link";
import { usePathname, useSearchParams } from "@/lib/router";
import type { CategoryNav } from "@/lib/categories";
import { buildCategoryProductosUrl } from "@/lib/slug";
import CategoriesDrawer from "./CategoriesDrawer";
import styles from "./Nav.module.scss";

type SubNavigationProps = {
  categories: CategoryNav[];
};

function SubNavigationContent({ categories }: SubNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const topCategories = categories.slice(0, 5);
  const activeCategorySlug = searchParams.get("categoria");

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  const isAllProductsActive =
    pathname === "/productos" &&
    !searchParams.get("categoria") &&
    !searchParams.get("subcategoria") &&
    !searchParams.get("q");

  return (
    <>
      <div className={styles.subNavigation}>
        <div className={styles.subNavigationInner}>
          <button
            type="button"
            className={`${styles.subNavTrigger}${
              isAllProductsActive ? ` ${styles.subNavLinkActive}` : ""
            }`}
            onClick={() => setIsDrawerOpen(true)}
          >
            Todos los Productos
          </button>

          <div className={styles.subNavigationLinks}>
            {topCategories.map((category) => {
              const isActive =
                pathname === "/productos" &&
                activeCategorySlug === category.slug &&
                !searchParams.get("subcategoria");

              return (
                <Link
                  key={category.id}
                  href={buildCategoryProductosUrl(category.slug)}
                  className={`${styles.subNavLink}${
                    isActive ? ` ${styles.subNavLinkActive}` : ""
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <CategoriesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
      />
    </>
  );
}

export default function SubNavigation({ categories }: SubNavigationProps) {
  return (
    <Suspense fallback={<div className={styles.subNavigation} />}>
      <SubNavigationContent categories={categories} />
    </Suspense>
  );
}
