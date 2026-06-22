import Link from "next/link";

export default function CarritoPage() {
  return (
    <main>
      <h1>Carrito</h1>
      <p>Aquí se mostrarán los productos agregados al carrito.</p>

      <nav>
        <Link href="/">Seguir comprando</Link>
        <Link href="/productos">Ver productos</Link>
      </nav>
    </main>
  );
}
