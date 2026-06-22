import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crespo React Shop",
  description: "Demo de rutas con Next.js y TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#0f172a",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 600 }}>Crespo React Shop</span>
          <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            Demo Next.js + TypeScript
          </span>
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
          © {new Date().getFullYear()} Crespo React. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
