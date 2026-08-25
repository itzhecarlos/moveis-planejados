"use server";

import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  customerFiscalProfileSchema,
  customerSignInSchema,
  customerSignUpSchema,
  onlyDigits,
  type CustomerFiscalProfileInput
} from "@/validations/customer-account";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function signUpCustomer(input: unknown): Promise<ActionResult> {
  const payload = customerSignUpSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: payload.error.issues[0]?.message || "Revise os dados do cadastro." };
  }

  const supabase = createSupabaseServerClient();
  const adminSupabase = createSupabaseAdminClient();

  if (!adminSupabase) {
    return { success: false, message: "Supabase administrativo não está configurado." };
  }

  const normalized = normalizeProfileInput(payload.data);
  const { data, error } = await supabase.auth.signUp({
    email: normalized.email,
    password: payload.data.password,
    options: {
      data: {
        full_name: normalized.fullName
      }
    }
  });

  if (error || !data.user) {
    return { success: false, message: error?.message || "Não foi possível criar a conta." };
  }

  const result = await upsertCustomerProfile(data.user.id, normalized);

  if (!result.success) {
    return result;
  }

  return { success: true, message: "Conta criada com sucesso." };
}

export async function signInCustomer(input: unknown): Promise<ActionResult> {
  const payload = customerSignInSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: payload.error.issues[0]?.message || "Revise e-mail e senha." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.data.email.trim().toLowerCase(),
    password: payload.data.password
  });

  if (error) {
    return { success: false, message: "E-mail ou senha inválidos." };
  }

  return { success: true, message: "Login realizado com sucesso." };
}

export async function updateCustomerFiscalProfile(input: unknown): Promise<ActionResult> {
  const payload = customerFiscalProfileSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: payload.error.issues[0]?.message || "Revise os dados fiscais." };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Faça login para atualizar seus dados." };
  }

  return upsertCustomerProfile(user.id, normalizeProfileInput(payload.data));
}

export async function signOutCustomer() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}

async function upsertCustomerProfile(userId: string, input: CustomerFiscalProfileInput): Promise<ActionResult> {
  const adminSupabase = createSupabaseAdminClient();

  if (!adminSupabase) {
    return { success: false, message: "Supabase administrativo não está configurado." };
  }

  const { error } = await adminSupabase.from("customer_profiles").upsert({
    id: userId,
    email: input.email,
    full_name: input.fullName,
    phone: onlyDigits(input.phone),
    document_type: input.documentType,
    document_number: onlyDigits(input.documentNumber),
    is_company: input.documentType === "cnpj" || input.isCompany,
    legal_name: input.legalName || null,
    trade_name: input.tradeName || null,
    state_registration: input.stateRegistration || null,
    municipal_registration: input.municipalRegistration || null,
    postal_code: onlyDigits(input.postalCode),
    street: input.street,
    number: input.number,
    complement: input.complement || null,
    neighborhood: input.neighborhood,
    city: input.city,
    state: input.state.trim().toUpperCase().slice(0, 2),
    notes: input.notes || null,
    fiscal_consent: input.fiscalConsent
  });

  if (error) {
    return { success: false, message: "Não foi possível salvar os dados fiscais." };
  }

  return { success: true, message: "Dados salvos com sucesso." };
}

function normalizeProfileInput<T extends CustomerFiscalProfileInput>(input: T): T {
  return {
    ...input,
    email: input.email.trim().toLowerCase(),
    fullName: input.fullName.trim(),
    phone: onlyDigits(input.phone),
    documentNumber: onlyDigits(input.documentNumber),
    postalCode: onlyDigits(input.postalCode),
    state: input.state.trim().toUpperCase().slice(0, 2)
  };
}
