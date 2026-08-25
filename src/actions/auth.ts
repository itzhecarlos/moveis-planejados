"use server";

import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAdmin(input: { email: string; password: string }) {
  const supabase = createSupabaseServerClient();
  const email = input.email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password
  });

  if (error || !data.user) {
    return { success: false as const, message: "E-mail ou senha inválidos." };
  }

  const adminSupabase = createSupabaseAdminClient();

  if (!adminSupabase) {
    await supabase.auth.signOut();
    return { success: false as const, message: "Supabase administrativo não está configurado." };
  }

  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .select("role, active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.active || !["admin", "editor"].includes(profile.role)) {
    await supabase.auth.signOut();
    return { success: false as const, message: "Sua conta não possui acesso ao painel administrativo." };
  }

  return { success: true as const };
}

export async function signOutAdmin() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
