
import ChangeDiffView from "./ChangeDiffView";
import styles from "./Admin.module.scss";
import type {
  CategoryLookup,
  CurrentProductContext,
} from "@/lib/admin/changeDiff";
import { getActionLabel, getStatusLabel } from "@/lib/admin/changeDiff";

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

type ChangeCardAccordionProps = {
  change: ChangeRecord;
  categories: CategoryLookup[];
  mode: "approvals" | "mine";
  isSubmitting: boolean;
  onReview: (changeId: number, decision: "approve" | "reject") => void;
};

export default function ChangeCardAccordion({
  change,
  categories,
  mode,
  isSubmitting,
  onReview,
}: ChangeCardAccordionProps) {
  const createdAt = new Date(change.createdAt).toLocaleString();
  const productLabel = change.currentProduct
    ? change.currentProduct.name
    : change.productId
      ? `Producto #${change.productId}`
      : "Sin producto";

  return (
    <details className={styles.changeAccordion}>
      <summary className={styles.changeAccordionSummary}>
        <span
          className={`${styles.badge} ${
            change.status === "PENDING"
              ? styles.badgePending
              : change.status === "APPROVED"
                ? styles.badgeApproved
                : styles.badgeRejected
          }`}
        >
          {getStatusLabel(change.status)}
        </span>

        <span className={styles.changeAccordionTitle}>
          <strong>{getActionLabel(change.action)}</strong>
          <span className={styles.changeAccordionMeta}>
            #{change.id} · {productLabel} · {change.submittedBy.username} ·{" "}
            {createdAt}
          </span>
        </span>

        <span className={styles.changeAccordionChevron} aria-hidden="true">
          ▾
        </span>
      </summary>

      <div className={styles.changeAccordionBody}>
        {change.reviewedBy && change.reviewedAt && (
          <p className={styles.panelDescription}>
            Revisado por {change.reviewedBy.username} ·{" "}
            {new Date(change.reviewedAt).toLocaleString()}
          </p>
        )}

        <ChangeDiffView
          action={change.action}
          payload={change.payload}
          currentProduct={change.currentProduct}
          categories={categories}
        />

        {mode === "approvals" && change.status === "PENDING" && (
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={isSubmitting}
              onClick={() => onReview(change.id, "approve")}
            >
              Aprobar
            </button>
            <button
              type="button"
              className={styles.dangerButton}
              disabled={isSubmitting}
              onClick={() => onReview(change.id, "reject")}
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
