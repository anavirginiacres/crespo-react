import type { Metadata } from "next";
import "./globals.scss";
import Nav from "@/components/Navigation/Nav";
import Footer from "@/components/Footer/Footer";
import { CartProvider } from "@/context/CartContext";
import logoIcon from "@/styles/images/logo-redondo.png";

export const metadata: Metadata = {
  title: "FF Crespo",
  description: "Industria Gráfica y Textil",
  icons: {
    icon: logoIcon.src,
    apple: logoIcon.src,
  },
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
          <Nav />

          {children}
        </CartProvider>

        <Footer />
      </body>
    </html>
  );
}
