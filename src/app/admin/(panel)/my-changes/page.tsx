import ChangesPanel from "@/components/Admin/ChangesPanel";
import { getCurrentSessionUser } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export default async function AdminMyChangesPage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <ChangesPanel mode="mine" />;
}
