import AdminSubcategoriesPanel from "@/components/Admin/AdminSubcategoriesPanel";
import { AdminRoleGuard } from "./AdminLayout";

export default function AdminSubcategoriesPage() {
  return (
    <AdminRoleGuard role="ADMIN">
      <AdminSubcategoriesPanel />
    </AdminRoleGuard>
  );
}
