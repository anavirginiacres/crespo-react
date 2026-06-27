import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFound/NotFoundContent";

export const metadata: Metadata = {
  title: "404 · Página no encontrada · FF Crespo",
  description: "La página que buscás no existe o fue movida.",
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}
