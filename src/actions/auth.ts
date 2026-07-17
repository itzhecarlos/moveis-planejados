"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAdmin(input: { email: string; password: string }) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password
  });

  if (error || !data.user) {
    return { success: false as const, message: "E-mail ou senha inválidos." };
  }

  const { data: profile, error: profileError } = await supabase
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
