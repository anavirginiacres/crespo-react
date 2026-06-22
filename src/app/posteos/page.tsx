import Link from "next/link";

export default function PosteosPage() {
  return (
    <main>
      <h1>Posteos</h1>
      <p>Listado de posteos o artículos del blog.</p>

      <ul>
        <li>Posteo 1</li>
        <li>Posteo 2</li>
        <li>Posteo 3</li>
      </ul>

      <nav>
        <Link href="/">Volver al inicio</Link>
      </nav>
    </main>
  );
}
