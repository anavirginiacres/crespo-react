"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NotFound.module.scss";

type NotFoundContentProps = {
  title?: string;
  description?: string;
};

export default function NotFoundContent({
  title = "Página no encontrada",
  description = "La página que buscás no existe o fue movida. Probá volver al inicio o explorar el catálogo.",
}: NotFoundContentProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          {isAdmin ? (
            <>
              <Link href="/admin/products" className={styles.primaryLink}>
                Ir al admin
              </Link>
              <Link href="/admin/login" className={styles.secondaryLink}>
                Ingresar
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={styles.primaryLink}>
                Volver al inicio
              </Link>
              <Link href="/productos" className={styles.secondaryLink}>
                Ver productos
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
