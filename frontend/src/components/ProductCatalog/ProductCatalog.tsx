
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CategoryNav } from "@/lib/categories";
import type { CatalogFiltersState, CatalogProduct } from "@/lib/catalogUtils";
import {
  buildFilterPills,
  filterAndSortProducts,
  type SortOrder,
} from "@/lib/catalogUtils";
import { useCart } from "@/context/CartContext";
import AddToCartModal from "./AddToCartModal";
import ProductCard from "./ProductCard";
import styles from "./ProductCatalog.module.scss";

type ProductCatalogProps = {
  products: CatalogProduct[];
  categories: CategoryNav[];
  initialFilters?: Partial<CatalogFiltersState>;
};

const defaultFilters: CatalogFiltersState = {
  search: "",
  categoryIds: [],
  subcategoryIds: [],
  sort: "asc",
};

function buildFiltersFromInitial(
  initialFilters?: Partial<CatalogFiltersState>
): CatalogFiltersState {
  return {
    ...defaultFilters,
    ...initialFilters,
    categoryIds: initialFilters?.categoryIds ?? [],
    subcategoryIds: initialFilters?.subcategoryIds ?? [],
  };
}

export default function ProductCatalog({
  products,
  categories,
  initialFilters,
}: ProductCatalogProps) {
  const { addItem } = useCart();
  const [filters, setFilters] = useState<CatalogFiltersState>(() =>
    buildFiltersFromInitial(initialFilters)
  );
  const [modalProduct, setModalProduct] = useState<CatalogProduct | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<number>>(
    () => {
      const ids = new Set<number>();
      for (const category of categories) {
        const hasSelectedSubcategory = category.subcategories.some((subcategory) =>
          (initialFilters?.subcategoryIds ?? []).includes(subcategory.id)
        );
        if (hasSelectedSubcategory) {
          ids.add(category.id);
        }
      }
      return ids;
    }
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

  const isCategoryExpanded = (category: CategoryNav) => {
    const hasSelectedSubcategory = category.subcategories.some((subcategory) =>
      filters.subcategoryIds.includes(subcategory.id)
    );
    return hasSelectedSubcategory || expandedCategoryIds.has(category.id);
  };

  const handleAddToCart = useCallback((product: CatalogProduct) => {
    setModalProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalProduct(null);
  }, []);

  const handleConfirmAddToCart = useCallback(
    (payload: Parameters<typeof addItem>[0]) => {
      addItem(payload);
      setModalProduct(null);
    },
    [addItem]
  );

  useEffect(() => {
    setFilters(buildFiltersFromInitial(initialFilters));
  }, [
    initialFilters?.search,
    initialFilters?.sort,
    initialFilters?.categoryIds?.join(","),
    initialFilters?.subcategoryIds?.join(","),
  ]);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const pills = useMemo(
    () => buildFilterPills(filters, categories),
    [filters, categories]
  );

  const toggleCategory = (categoryId: number) => {
    setFilters((current) => {
      const isSelected = current.categoryIds.includes(categoryId);
      const categoryIds = isSelected
        ? current.categoryIds.filter((id) => id !== categoryId)
        : [...current.categoryIds, categoryId];

      const category = categories.find((item) => item.id === categoryId);
      const subcategoryIds = isSelected
        ? current.subcategoryIds.filter(
            (id) =>
              !category?.subcategories.some((subcategory) => subcategory.id === id)
          )
        : current.subcategoryIds;

      return { ...current, categoryIds, subcategoryIds };
    });
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setFilters((current) => {
      const isSelected = current.subcategoryIds.includes(subcategoryId);
      return {
        ...current,
        subcategoryIds: isSelected
          ? current.subcategoryIds.filter((id) => id !== subcategoryId)
          : [...current.subcategoryIds, subcategoryId],
      };
    });
  };

  const removePill = (pill: ReturnType<typeof buildFilterPills>[number]) => {
    if (pill.type === "search") {
      setFilters((current) => ({ ...current, search: "" }));
      return;
    }

    if (pill.type === "category") {
      toggleCategory(pill.categoryId);
      return;
    }

    toggleSubcategory(pill.subcategoryId);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const pageTitle = useMemo(() => {
    if (filters.subcategoryIds.length === 1) {
      for (const category of categories) {
        const subcategory = category.subcategories.find(
          (item) => item.id === filters.subcategoryIds[0]
        );
        if (subcategory) return subcategory.name;
      }
    }

    if (filters.categoryIds.length === 1) {
      const category = categories.find(
        (item) => item.id === filters.categoryIds[0]
      );
      if (category) return category.name;
    }

    if (filters.search.trim()) return "Resultados de búsqueda";

    return "Todos los productos";
  }, [filters.categoryIds, filters.subcategoryIds, filters.search, categories]);

  const pageDescription = useMemo(() => {
    if (filters.subcategoryIds.length === 1) {
      for (const category of categories) {
        const subcategory = category.subcategories.find(
          (item) => item.id === filters.subcategoryIds[0]
        );
        if (subcategory) {
          return `Productos en ${category.name} / ${subcategory.name}.`;
        }
      }
    }

    if (filters.categoryIds.length === 1) {
      const category = categories.find(
        (item) => item.id === filters.categoryIds[0]
      );
      if (category) return `Productos en ${category.name}.`;
    }

    return "Filtrá por categoría, subcategoría o palabra clave. Los resultados se actualizan al instante.";
  }, [filters.categoryIds, filters.subcategoryIds, categories]);

  return (
    <div className={styles.catalog}>
      <header className={styles.catalogHeader}>
        <div>
          <p className={styles.catalogEyebrow}>Catálogo</p>
          <h1 className={styles.catalogTitle}>{pageTitle}</h1>
          <p className={styles.catalogDescription}>{pageDescription}</p>
        </div>
        <p className={styles.resultsCount}>
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      <div className={styles.catalogLayout}>
        <aside className={styles.filtersPanel} aria-label="Filtros del catálogo">
          <button
            type="button"
            className={styles.filtersToggle}
            onClick={() => setIsFiltersOpen((open) => !open)}
            aria-expanded={isFiltersOpen}
            aria-controls="catalog-filters"
          >
            <span className={styles.filtersToggleLabel}>
              Filtros
              {pills.length > 0 && (
                <span className={styles.filtersToggleBadge}>{pills.length}</span>
              )}
            </span>
            <span
              className={`${styles.filtersToggleIcon}${
                isFiltersOpen ? ` ${styles.filtersToggleIconOpen}` : ""
              }`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          <div
            id="catalog-filters"
            className={`${styles.filtersCollapse}${
              isFiltersOpen ? ` ${styles.filtersCollapseOpen}` : ""
            }`}
          >
            <div className={styles.filtersCollapseInner}>
          <div className={styles.filterBlock}>
            <label className={styles.filterLabel} htmlFor="catalog-search">
              Buscar
            </label>
            <div className={styles.searchField}>
              <input
                id="catalog-search"
                type="text"
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Nombre, tags o descripción..."
                className={styles.catalogSearchInput}
                autoComplete="off"
              />
              {filters.search.length > 0 && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() =>
                    setFilters((current) => ({ ...current, search: "" }))
                  }
                  aria-label="Borrar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className={styles.filterBlock}>
            <label className={styles.filterLabel} htmlFor="catalog-sort">
              Ordenar
            </label>
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  sort: event.target.value as SortOrder,
                }))
              }
              className={styles.sortSelect}
            >
              <option value="asc">Nombre A → Z</option>
              <option value="desc">Nombre Z → A</option>
            </select>
          </div>

          <div className={styles.filterBlock}>
            <p className={styles.filterLabel}>Categorías</p>
            <ul className={styles.checkboxList}>
              {categories.map((category) => {
                const hasSubcategories = category.subcategories.length > 0;
                const isExpanded = isCategoryExpanded(category);

                return (
                <li key={category.id} className={styles.categoryFilterItem}>
                  <div className={styles.categoryFilterRow}>
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={filters.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <span>{category.name}</span>
                    </label>

                    {hasSubcategories && (
                      <button
                        type="button"
                        className={styles.categoryDropdownToggle}
                        aria-expanded={isExpanded}
                        aria-controls={`catalog-subcategories-${category.id}`}
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
                      id={`catalog-subcategories-${category.id}`}
                      className={styles.subcategoryList}
                    >
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <label className={styles.checkboxItem}>
                            <input
                              type="checkbox"
                              checked={filters.subcategoryIds.includes(
                                subcategory.id
                              )}
                              onChange={() =>
                                toggleSubcategory(subcategory.id)
                              }
                            />
                            <span>{subcategory.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                );
              })}
            </ul>
          </div>
            </div>
          </div>
        </aside>

        <section className={styles.catalogMain}>
          {pills.length > 0 && (
            <div className={styles.pillsRow}>
              <div className={styles.pillsList}>
                {pills.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    className={styles.pill}
                    onClick={() => removePill(pill)}
                  >
                    <span>{pill.label}</span>
                    <span className={styles.pillRemove} aria-hidden="true">
                      ×
                    </span>
                    <span className={styles.srOnly}>
                      Quitar filtro {pill.label}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.clearFiltersButton}
                onClick={clearAllFilters}
              >
                Limpiar todos
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No encontramos productos</h2>
              <p>Probá ajustando los filtros o limpiando la búsqueda.</p>
              {pills.length > 0 && (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={clearAllFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <AddToCartModal
        product={modalProduct}
        isOpen={modalProduct !== null}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAddToCart}
      />
    </div>
  );
}
