"use server";

import { requireEditorOrAdmin } from "@/lib/auth";

export async function uploadProductImage() {
  await requireEditorOrAdmin();
  return { success: false, message: "Configure o bucket product-images no Supabase para habilitar uploads reais." };
}
