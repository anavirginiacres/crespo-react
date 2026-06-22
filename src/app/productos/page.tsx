import Link from "next/link";

const productos = [
  { slug: "producto-1", nombre: "Producto 1" },
  { slug: "producto-2", nombre: "Producto 2" },
  { slug: "producto-3", nombre: "Producto 3" },
];

export default function ProductosPage() {
  return (
    <main>
      <h1>Productos</h1>
      <p>Lista de productos de ejemplo. Cada uno lleva a una ruta dinámica.</p>

      <ul>
        {productos.map((producto) => (
          <li key={producto.slug}>
            <Link href={`/productos/${producto.slug}`}>{producto.nombre}</Link>
          </li>
        ))}
      </ul>

      <nav>
        <Link href="/">Volver al inicio</Link>
      </nav>
    </main>
  );
}
