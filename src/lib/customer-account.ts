import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CustomerProfileRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  document_type: "cpf" | "cnpj";
  document_number: string;
  is_company: boolean;
  legal_name: string | null;
  trade_name: string | null;
  state_registration: string | null;
  municipal_registration: string | null;
  postal_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  notes: string | null;
  fiscal_consent: boolean;
};

export async function requireCustomerAccount() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const profile = await getCustomerProfile(user.id);

  return {
    user,
    profile
  };
}

export async function getCustomerProfile(userId: string) {
  const adminSupabase = createSupabaseAdminClient();

  if (!adminSupabase) return null;

  const { data } = await adminSupabase
    .from("customer_profiles")
    .select(
      "id, email, full_name, phone, document_type, document_number, is_company, legal_name, trade_name, state_registration, municipal_registration, postal_code, street, number, complement, neighborhood, city, state, notes, fiscal_consent"
    )
    .eq("id", userId)
    .maybeSingle();

  return (data as CustomerProfileRow | null) || null;
}
