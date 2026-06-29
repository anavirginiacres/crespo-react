import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminShell from "@/components/Admin/AdminShell";
import { api } from "@/lib/api";
import type { SessionUser } from "@/lib/admin/types";

export default function AdminLayout() {
  const location = useLocation();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    api
      .adminSession()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null));
  }, [location.pathname]);

  if (user === undefined) {
    return <p style={{ padding: 24 }}>Cargando...</p>;
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }

  return (
    <AdminShell user={user}>
      <Outlet context={{ user }} />
    </AdminShell>
  );
}

export function AdminRoleGuard({
  role,
  children,
}: {
  role: "ADMIN";
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    api
      .adminSession()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null));
  }, [location.pathname]);

  if (user === undefined) {
    return <p style={{ padding: 24 }}>Cargando...</p>;
  }

  if (!user || user.role !== role) {
    return <Navigate to="/admin/products" replace />;
  }

  return <>{children}</>;
}
