import Link from "next/link";

interface ProductoDetallePageProps {
  params: {
    slug: string;
  };
}

export default function ProductoDetallePage({ params }: ProductoDetallePageProps) {
  const { slug } = params;

  return (
    <main>
      <h1>Detalle de producto</h1>
      <p>
        Estás viendo el producto con slug:{" "}
        <code>{slug}</code>
      </p>

      <nav>
        <Link href="/productos">Volver a productos</Link>
        <Link href="/">Volver al inicio</Link>
      </nav>
    </main>
  );
}
