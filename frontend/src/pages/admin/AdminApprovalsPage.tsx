import ChangesPanel from "@/components/Admin/ChangesPanel";
import { AdminRoleGuard } from "./AdminLayout";

export default function AdminApprovalsPage() {
  return (
    <AdminRoleGuard role="ADMIN">
      <ChangesPanel mode="approvals" />
    </AdminRoleGuard>
  );
}
