
import styles from "./Admin.module.scss";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

export default function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  isLoading = false,
  onPageChange,
  itemLabel = "resultados",
}: AdminPaginationProps) {
  if (total <= 0) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || isLoading) {
      return;
    }
    onPageChange(nextPage);
  }

  return (
    <div className={styles.paginationBar}>
      <p className={styles.paginationSummary}>
        Mostrando {rangeStart}–{rangeEnd} de {total} {itemLabel}
      </p>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={page <= 1 || isLoading}
          onClick={() => goToPage(1)}
          aria-label="Primera página"
        >
          ««
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={page <= 1 || isLoading}
          onClick={() => goToPage(page - 1)}
        >
          Anterior
        </button>

        <span className={styles.paginationLabel}>
          Página {page} de {totalPages}
        </span>

        <button
          type="button"
          className={styles.secondaryButton}
          disabled={page >= totalPages || isLoading}
          onClick={() => goToPage(page + 1)}
        >
          Siguiente
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={page >= totalPages || isLoading}
          onClick={() => goToPage(totalPages)}
          aria-label="Última página"
        >
          »»
        </button>
      </div>
    </div>
  );
}
