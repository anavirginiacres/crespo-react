"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/admin/types";
import styles from "./Admin.module.scss";

type AdminShellProps = {
  user: SessionUser;
  children: React.ReactNode;
};

export default function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const links = [
    { href: "/admin/products", label: "Productos" },
    ...(user.role === "ADMIN"
      ? [
          { href: "/admin/approvals", label: "Aprobaciones" },
          { href: "/admin/subcategories", label: "Subcategorías" },
        ]
      : [{ href: "/admin/my-changes", label: "Mis cambios" }]),
  ];

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.brand}>FF Crespo Admin</h1>
          <p className={styles.userMeta}>
            {user.username} · {user.role}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" target="_blank">
            Ver sitio
          </Link>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      </header>

      <nav className={styles.nav} aria-label="Admin navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink}${
              pathname.startsWith(link.href) ? ` ${styles.navLinkActive}` : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
