"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoHeader from "@/styles/images/logo-original.png";
import type { CategoryNav } from "@/lib/categories";
import type { ProductQuantityOptionsMap } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";
import SubNavigation from "./SubNavigation";
import CartDrawer from "./CartDrawer";
import styles from "./Nav.module.scss";

type NavBarProps = {
  categories: CategoryNav[];
  quantityOptionsByProductId?: ProductQuantityOptionsMap;
};

export default function NavBar({
  categories,
  quantityOptionsByProductId = {},
}: NavBarProps) {
  const pathname = usePathname();
  const { totalItems, itemAddedSignal } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBadgeAnimating, setIsBadgeAnimating] = useState(false);
  const lastAddedSignalRef = useRef(0);

  function handleContactClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;

    event.preventDefault();
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", "/#contacto");
  }

  useEffect(() => {
    if (itemAddedSignal === lastAddedSignalRef.current) return;

    lastAddedSignalRef.current = itemAddedSignal;
    setIsBadgeAnimating(true);

    const timeoutId = window.setTimeout(() => {
      setIsBadgeAnimating(false);
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [itemAddedSignal]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
      );
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <>
      <header
        role="banner"
        ref={headerRef}
        className={`${styles.header}${isScrolled ? ` ${styles.headerFixed}` : ""}`}
      >
        <div className={styles.navBar}>
          <nav role="navigation" className={styles.nav}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src={logoHeader}
                alt="FF Crespo"
                className={styles.logoHeader}
                priority
              />
            </Link>

            <Suspense fallback={<div className={styles.searchForm} />}>
              <SearchBar />
            </Suspense>

            <div className={styles.navActions}>
              <Link
                href="/#contacto"
                className={styles.contactButton}
                onClick={handleContactClick}
                aria-label="Contacto"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </Link>

              <button
                type="button"
                className={`${styles.cartButton}${
                  isBadgeAnimating ? ` ${styles.cartButtonPulse}` : ""
                }`}
                onClick={() => setIsCartOpen(true)}
                aria-label={`Abrir carrito${totalItems > 0 ? `, ${totalItems} productos` : ""}`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {totalItems > 0 && (
                  <span
                    className={`${styles.cartBadge}${
                      isBadgeAnimating ? ` ${styles.cartBadgePulse}` : ""
                    }`}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>

        <SubNavigation categories={categories} />
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        quantityOptionsByProductId={quantityOptionsByProductId}
      />
    </>
  );
}
