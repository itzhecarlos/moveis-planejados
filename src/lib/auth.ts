import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminAccess() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.active || !["admin", "editor"].includes(profile.role)) {
    redirect("/admin/login");
  }

  return {
    user,
    profile
  };
}
