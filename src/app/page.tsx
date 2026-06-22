import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Inicio</h1>
      <p>Bienvenida/o a la demo de rutas con Next.js + TypeScript.</p>

      <nav>
        <Link href="/productos">Productos</Link>
        <Link href="/productos/detalle">Detalle de producto</Link>
        <Link href="/carrito">Carrito</Link>
        <Link href="/posteos">Posteos</Link>
      </nav>
    </main>
  );
}
