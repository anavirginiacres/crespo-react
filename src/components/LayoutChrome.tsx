"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Navigation/Nav";
import Footer from "@/components/Footer/Footer";

type LayoutChromeProps = {
  nav: React.ReactNode;
  children: React.ReactNode;
};

export default function LayoutChrome({ nav, children }: LayoutChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {nav}
      {children}
      <Footer />
    </>
  );
}
