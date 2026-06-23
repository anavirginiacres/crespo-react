import type { Metadata } from "next";
import "./globals.scss";
import Nav from "@/components/Navigation/Nav";
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

        <footer
          style={{
            marginTop: "2rem",
            padding: "1rem 2rem",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#6b7280",
          }}
        >
          © {new Date().getFullYear()} FF CRESPO. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
