
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SessionUser } from "@/lib/admin/types";
import AdminPagination from "./AdminPagination";
import ProductEditor from "./ProductEditor";
import styles from "./Admin.module.scss";

type CategoryOption = {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
};

type ProductListItem = {
  id: number;
  name: string;
  caption: string | null;
  image: string | null;
  tags: string | null;
  new_product: boolean;
  id_category: number;
  id_subcategory: number;
  category: { name: string };
  subcategory: { name: string };
};

type ProductRecord = ProductListItem & {
  materials: string | null;
  measures: string | null;
  quantity: string | null;
  details: string | null;
  caution: string | null;
  colors: string | null;
  delay: string | null;
  images: { id: number; src: string }[];
};

type AdminProductsPanelProps = {
  user: SessionUser;
};

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

export default function AdminProductsPanel({ user }: AdminProductsPanelProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");

  const [selectedProductId, setSelectedProductId] = useState<number | "new">(
    "new"
  );
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(
    null
  );
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data: { categories: CategoryOption[] }) => {
        setCategories(data.categories ?? []);
      })
      .catch(() => setError("No se pudieron cargar las categorías"));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const subcategoryOptions = useMemo(() => {
    const categoryId = Number(categoryFilter);
    if (!categoryId) return [];
    return (
      categories.find((category) => category.id === categoryId)?.subcategories ??
      []
    );
  }, [categories, categoryFilter]);

  const loadProducts = useCallback(async () => {
    setIsLoadingList(true);
    setError("");

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    if (subcategoryFilter) params.set("subcategoryId", subcategoryFilter);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    try {
      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = (await response.json()) as {
        products?: ProductListItem[];
        total?: number;
        totalPages?: number;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "No se pudieron cargar los productos");
        return;
      }

      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setError("No se pudieron cargar los productos");
    } finally {
      setIsLoadingList(false);
    }
  }, [searchQuery, categoryFilter, subcategoryFilter, page]);

  useEffect(() => {
    loadProducts().catch(() => setError("No se pudieron cargar los productos"));
  }, [loadProducts]);

  const loadProductForEdit = useCallback(async (productId: number) => {
    setIsLoadingProduct(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = (await response.json()) as {
        product?: ProductRecord;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "No se pudo cargar el producto");
        return;
      }

      setEditingProduct(data.product ?? null);
    } catch {
      setError("No se pudo cargar el producto");
    } finally {
      setIsLoadingProduct(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProductId === "new") {
      setEditingProduct(null);
      return;
    }

    loadProductForEdit(selectedProductId).catch(() =>
      setError("No se pudo cargar el producto")
    );
  }, [selectedProductId, loadProductForEdit]);

  function handleCategoryFilterChange(value: string) {
    setCategoryFilter(value);
    setSubcategoryFilter("");
    setPage(1);
  }

  function handleSubcategoryFilterChange(value: string) {
    setSubcategoryFilter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearchQuery("");
    setCategoryFilter("");
    setSubcategoryFilter("");
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasActiveFilters = Boolean(
    searchQuery || categoryFilter || subcategoryFilter
  );

  function handleSaved(nextMessage: string) {
    setMessage(nextMessage);
    loadProducts().catch(() => setError("No se pudieron actualizar los productos"));

    if (selectedProductId !== "new") {
      loadProductForEdit(selectedProductId).catch(() =>
        setError("No se pudo actualizar el producto")
      );
    }
  }

  const resultLabel =
    total === 0
      ? "Sin resultados"
      : total === 1
        ? "1 producto"
        : `${total} productos`;

  return (
    <div className={styles.panel}>
      <div>
        <h2 className={styles.panelTitle}>Productos</h2>
        <p className={styles.panelDescription}>
          Gestioná el catálogo, imágenes principales, galería y tags.
        </p>
      </div>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.listToolbar}>
        <div className={`${styles.field} ${styles.listSearchField}`}>
          <label className={styles.label} htmlFor="admin-product-search">
            Buscar
          </label>
          <input
            id="admin-product-search"
            className={styles.input}
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Nombre, ID o tags..."
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-product-category">
            Categoría
          </label>
          <select
            id="admin-product-category"
            className={styles.select}
            value={categoryFilter}
            onChange={(event) => handleCategoryFilterChange(event.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-product-subcategory">
            Subcategoría
          </label>
          <select
            id="admin-product-subcategory"
            className={styles.select}
            value={subcategoryFilter}
            onChange={(event) =>
              handleSubcategoryFilterChange(event.target.value)
            }
            disabled={!categoryFilter}
          >
            <option value="">Todas</option>
            {subcategoryOptions.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.listToolbarActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setSelectedProductId("new");
              setMessage("");
            }}
          >
            Nuevo producto
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className={styles.listMeta} ref={listRef}>
        <span>{resultLabel}</span>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        isLoading={isLoadingList}
        onPageChange={handlePageChange}
        itemLabel="productos"
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Tags</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingList ? (
              <tr>
                <td colSpan={5} className={styles.tableEmpty}>
                  Cargando productos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.tableEmpty}>
                  {hasActiveFilters
                    ? "No hay productos que coincidan con la búsqueda."
                    : "No hay productos cargados."}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className={
                    selectedProductId === product.id
                      ? styles.tableRowSelected
                      : undefined
                  }
                >
                  <td>{product.id}</td>
                  <td>
                    <span className={styles.productNameCell}>{product.name}</span>
                    {product.caption && (
                      <span className={styles.productCaptionCell}>
                        {product.caption}
                      </span>
                    )}
                  </td>
                  <td>
                    {product.category.name} / {product.subcategory.name}
                  </td>
                  <td>{product.tags ?? "—"}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setMessage("");
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        isLoading={isLoadingList}
        onPageChange={handlePageChange}
        itemLabel="productos"
      />

      {isLoadingProduct && selectedProductId !== "new" ? (
        <p className={styles.panelDescription}>Cargando producto...</p>
      ) : (
        <ProductEditor
          key={editingProduct?.id ?? "new"}
          user={user}
          product={selectedProductId === "new" ? null : editingProduct}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
