import { Navigate, useLocation } from "react-router-dom";

/** Normaliza la URL a minúsculas (/Productos → /productos). */
export default function LowercaseRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname, search, hash } = useLocation();
  const lower = pathname.toLowerCase();

  if (pathname !== lower) {
    return <Navigate to={`${lower}${search}${hash}`} replace />;
  }

  return <>{children}</>;
}
