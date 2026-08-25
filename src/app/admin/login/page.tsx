import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const adminSupabase = createSupabaseAdminClient();
    const { data: profile } = adminSupabase
      ? await adminSupabase.from("profiles").select("role, active").eq("id", user.id).maybeSingle()
      : { data: null };

    if (profile?.active && ["admin", "editor"].includes(profile.role)) {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.32em] text-stone-500">Admin</p>
        <h1 className="mt-3 font-serif text-4xl">Entrar no painel</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
