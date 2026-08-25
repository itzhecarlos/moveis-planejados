import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminAccess } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdminAccess();

  return <AdminShell profileName={profile.full_name || "Administrador"}>{children}</AdminShell>;
}
