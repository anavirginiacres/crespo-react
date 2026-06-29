import { ReactNode } from "react";
import Footer from "@/components/Footer/Footer";

type LayoutChromeProps = {
  nav: ReactNode;
  children: ReactNode;
};

export default function LayoutChrome({ nav, children }: LayoutChromeProps) {
  return (
    <>
      {nav}
      {children}
      <Footer />
    </>
  );
}
