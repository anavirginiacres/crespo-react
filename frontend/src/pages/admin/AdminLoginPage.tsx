import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    api
      .adminSession()
      .then((res) => setHasSession(Boolean(res.user)))
      .catch(() => setHasSession(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return null;
  }

  if (hasSession) {
    const next = searchParams.get("next") || "/admin/products";
    return <Navigate to={next} replace />;
  }

  return <AdminLoginForm />;
}
