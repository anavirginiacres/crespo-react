import { redirect } from "next/navigation";
import AdminShell from "@/components/Admin/AdminShell";
import { getCurrentSessionUser } from "@/lib/admin/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
