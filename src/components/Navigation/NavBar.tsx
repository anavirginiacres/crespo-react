"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoHeader from "@/styles/images/logo-original.png";
import type { CategoryNav } from "@/lib/categories";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";
import SubNavigation from "./SubNavigation";
import ContactModal from "./ContactModal";
import CartDrawer from "./CartDrawer";
import styles from "./Nav.module.scss";

type NavBarProps = {
  categories: CategoryNav[];
};

export default function NavBar({ categories }: NavBarProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    setIsContactOpen(false);
    setIsCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow =
      isContactOpen || isCartOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isContactOpen, isCartOpen]);

  return (
    <>
      <header role="banner" className={styles.header} ref={headerRef}>
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
              <button
                type="button"
                className={styles.navActionButton}
                onClick={() => setIsContactOpen(true)}
              >
                Contacto
              </button>

              <Link
                href="/posteos"
                className={`${styles.navActionLink}${
                  pathname.startsWith("/posteos") ? ` ${styles.active}` : ""
                }`}
              >
                Posteos
              </Link>

              <button
                type="button"
                className={styles.cartButton}
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
                  <span className={styles.cartBadge}>{totalItems}</span>
                )}
              </button>
            </div>
          </nav>
        </div>

        <SubNavigation categories={categories} />
      </header>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
