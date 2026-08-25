import { HeaderClient } from "@/components/layout/header-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let showAdminPanel = false;

  if (user) {
    const adminSupabase = createSupabaseAdminClient();
    const { data: profile } = adminSupabase
      ? await adminSupabase.from("profiles").select("role, active").eq("id", user.id).maybeSingle()
      : { data: null };

    showAdminPanel = Boolean(profile?.active && ["admin", "editor"].includes(profile.role));
  }

  return <HeaderClient showAdminPanel={showAdminPanel} />;
}
