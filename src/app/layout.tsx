import type { Metadata } from "next";
import "./globals.scss";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";
import logoIcon from "@/styles/images/logo-redondo.png";
import logoHeader from "@/styles/images/logo-original.png";

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
        <header role="banner">
          <nav role="navigation">
            <Link href="/"><Image src={logoHeader} alt="FF Crespo" className="logo-header" /></Link>
            <NavLinks />
          </nav>
        </header>

        {children}

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
