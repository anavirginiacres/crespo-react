import styles from "./Admin.module.scss";
import {
  buildChangeDiffRows,
  getActionLabel,
  type CategoryLookup,
  type CurrentProductContext,
} from "@/lib/admin/changeDiff";

type ChangeDiffViewProps = {
  action: string;
  payload: string;
  currentProduct?: CurrentProductContext | null;
  categories: CategoryLookup[];
};

export default function ChangeDiffView({
  action,
  payload,
  currentProduct,
  categories,
}: ChangeDiffViewProps) {
  const rows = buildChangeDiffRows({
    action,
    payload,
    currentProduct,
    categories,
  });

  if (rows.length === 0) {
    return (
      <p className={styles.panelDescription}>
        No se detectaron diferencias en este cambio.
      </p>
    );
  }

  return (
    <div className={styles.changeDiff}>
      <div className={styles.changeDiffHeader}>
        <span>Campo</span>
        <span>Actual</span>
        <span className={styles.changeDiffProposedLabel}>Propuesto</span>
      </div>

      {rows.map((row) => (
        <div
          key={row.key}
          className={`${styles.changeDiffRow}${
            row.isChanged ? ` ${styles.changeDiffRowHighlighted}` : ""
          }`}
        >
          <span className={styles.changeDiffLabel}>{row.label}</span>
          <span className={styles.changeDiffCurrent}>{row.current}</span>
          <span
            className={`${styles.changeDiffProposed}${
              row.isChanged ? ` ${styles.changeDiffProposedHighlight}` : ""
            }`}
          >
            {row.proposed}
          </span>
        </div>
      ))}

      <p className={styles.changeDiffHint}>
        {getActionLabel(action)} ·{" "}
        {rows.filter((row) => row.isChanged).length} campo
        {rows.filter((row) => row.isChanged).length === 1 ? "" : "s"} modificado
        {rows.filter((row) => row.isChanged).length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
