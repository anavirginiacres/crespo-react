import AdminProductsPanel from "@/components/Admin/AdminProductsPanel";
import { getCurrentSessionUser } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminProductsPanel user={user} />;
}
