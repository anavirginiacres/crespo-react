import AdminSubcategoriesPanel from "@/components/Admin/AdminSubcategoriesPanel";
import { getCurrentSessionUser } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export default async function AdminSubcategoriesPage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/admin/products");
  }

  return <AdminSubcategoriesPanel />;
}
