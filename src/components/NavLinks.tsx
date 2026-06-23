"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio", className: "nav-link", exact: true },
  { href: "/productos", label: "Catálogo", className: "nav-link" },
  { href: "/posteos", label: "Posteos", className: "nav-link" },
  { href: "/carrito", label: "Carrito", className: "nav-link-cart" },
] as const;

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="nav-links">
      {navItems.map(({ href, label, className, exact }) => {
        const isActive = isActivePath(pathname, href, exact);

        return (
          <Link
            key={href}
            href={href}
            className={`${className}${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
