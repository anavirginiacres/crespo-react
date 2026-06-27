import type { Metadata } from "next";
import "./globals.scss";
import Nav from "@/components/Navigation/Nav";
import LayoutChrome from "@/components/LayoutChrome";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "FF Crespo",
  description: "Industria Gráfica y Textil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <LayoutChrome nav={<Nav />}>{children}</LayoutChrome>
        </CartProvider>
      </body>
    </html>
  );
}
