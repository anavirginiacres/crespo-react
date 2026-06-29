import { useOutletContext } from "react-router-dom";
import AdminProductsPanel from "@/components/Admin/AdminProductsPanel";
import type { SessionUser } from "@/lib/admin/types";

export default function AdminProductsPage() {
  const { user } = useOutletContext<{ user: SessionUser }>();
  return <AdminProductsPanel user={user} />;
}
