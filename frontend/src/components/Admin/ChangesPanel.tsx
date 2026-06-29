
import { useCallback, useEffect, useRef, useState } from "react";
import ChangeCardAccordion from "./ChangeCardAccordion";
import AdminPagination from "./AdminPagination";
import styles from "./Admin.module.scss";
import type {
  CategoryLookup,
  CurrentProductContext,
} from "@/lib/admin/changeDiff";

type ChangeRecord = {
  id: number;
  action: string;
  status: string;
  productId: number | null;
  payload: string;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  submittedBy: { username: string; role: string };
  reviewedBy: { username: string; role: string } | null;
  currentProduct?: CurrentProductContext | null;
};

type ChangesPanelProps = {
  mode: "approvals" | "mine";
};

type StatusTab = "pending" | "completed";

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

export default function ChangesPanel({ mode }: ChangesPanelProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>("pending");
  const [changes, setChanges] = useState<ChangeRecord[]>([]);
  const [categories, setCategories] = useState<CategoryLookup[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [keywordInput, setKeywordInput] = useState("");
  const [keywordQuery, setKeywordQuery] = useState("");
  const [productInput, setProductInput] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data: { categories: CategoryLookup[] }) => {
        setCategories(data.categories ?? []);
      })
      .catch(() => setError("No se pudieron cargar las categorías"));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeywordQuery(keywordInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [keywordInput]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProductQuery(productInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [productInput]);

  const loadChanges = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.set("statusGroup", activeTab);
    if (keywordQuery) params.set("q", keywordQuery);
    if (productQuery) params.set("product", productQuery);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    try {
      const response = await fetch(`/api/admin/changes?${params.toString()}`);
      const data = (await response.json()) as {
        changes?: ChangeRecord[];
        total?: number;
        totalPages?: number;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "No se pudieron cargar los cambios");
        return;
      }

      setChanges(data.changes ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setError("No se pudieron cargar los cambios");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, keywordQuery, productQuery, dateFrom, dateTo, page]);

  useEffect(() => {
    loadChanges().catch(() => setError("No se pudieron cargar los cambios"));
  }, [loadChanges]);

  async function reviewChange(
    changeId: number,
    decision: "approve" | "reject"
  ) {
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/changes/${changeId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "No se pudo revisar el cambio");
        return;
      }

      setMessage(
        decision === "approve"
          ? `Cambio #${changeId} aprobado.`
          : `Cambio #${changeId} rechazado.`
      );
      await loadChanges();
    } catch {
      setError("No se pudo revisar el cambio");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTabChange(tab: StatusTab) {
    setActiveTab(tab);
    setPage(1);
    setMessage("");
  }

  function clearFilters() {
    setKeywordInput("");
    setKeywordQuery("");
    setProductInput("");
    setProductQuery("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasActiveFilters = Boolean(
    keywordQuery || productQuery || dateFrom || dateTo
  );

  const resultLabel =
    total === 0
      ? "Sin resultados"
      : total === 1
        ? "1 cambio"
        : `${total} cambios`;

  return (
    <div className={styles.panel}>
      <div>
        <h2 className={styles.panelTitle}>
          {mode === "approvals" ? "Aprobaciones" : "Mis cambios"}
        </h2>
        <p className={styles.panelDescription}>
          {mode === "approvals"
            ? "Revisá cambios pendientes o consultá el historial completado."
            : "Seguí el estado de los cambios que enviaste."}
        </p>
      </div>

      <div className={styles.changeTabs} role="tablist" aria-label="Estado de cambios">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "pending"}
          className={`${styles.changeTab}${
            activeTab === "pending" ? ` ${styles.changeTabActive}` : ""
          }`}
          onClick={() => handleTabChange("pending")}
        >
          Pendientes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "completed"}
          className={`${styles.changeTab}${
            activeTab === "completed" ? ` ${styles.changeTabActive}` : ""
          }`}
          onClick={() => handleTabChange("completed")}
        >
          Completados
        </button>
      </div>

      <div className={styles.changeFilters}>
        <div className={`${styles.field} ${styles.changeFilterField}`}>
          <label className={styles.label} htmlFor="change-keyword">
            Palabras clave
          </label>
          <input
            id="change-keyword"
            className={styles.input}
            type="search"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Acción, usuario, tags..."
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="change-product">
            Producto
          </label>
          <input
            id="change-product"
            className={styles.input}
            type="search"
            value={productInput}
            onChange={(event) => setProductInput(event.target.value)}
            placeholder="ID o nombre"
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="change-date-from">
            Desde
          </label>
          <input
            id="change-date-from"
            className={styles.input}
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="change-date-to">
            Hasta
          </label>
          <input
            id="change-date-to"
            className={styles.input}
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {hasActiveFilters && (
          <div className={styles.changeFilterActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className={styles.listMeta} ref={listRef}>
        <span>{resultLabel}</span>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        itemLabel="cambios"
      />

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      {isLoading ? (
        <p className={styles.panelDescription}>Cargando cambios...</p>
      ) : changes.length === 0 ? (
        <p className={styles.panelDescription}>
          {hasActiveFilters
            ? "No hay cambios que coincidan con los filtros."
            : activeTab === "pending"
              ? "No hay cambios pendientes."
              : "No hay cambios completados."}
        </p>
      ) : (
        <div className={styles.changeAccordionList}>
          {changes.map((change) => (
            <ChangeCardAccordion
              key={change.id}
              change={change}
              categories={categories}
              mode={mode}
              isSubmitting={isSubmitting}
              onReview={reviewChange}
            />
          ))}
        </div>
      )}

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        itemLabel="cambios"
      />
    </div>
  );
}
