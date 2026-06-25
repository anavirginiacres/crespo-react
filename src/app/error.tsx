"use client";

import { useEffect } from "react";
import NotFoundContent from "@/components/NotFound/NotFoundContent";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <NotFoundContent
      title="Algo salió mal"
      description="Ocurrió un error inesperado. Volvé al inicio para continuar navegando."
    />
  );
}
