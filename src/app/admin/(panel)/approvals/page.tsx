import ChangesPanel from "@/components/Admin/ChangesPanel";
import { getCurrentSessionUser } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export default async function AdminApprovalsPage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/admin/products");
  }

  return <ChangesPanel mode="approvals" />;
}
