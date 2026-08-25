"use server";

import { revalidatePath } from "next/cache";

import { requireEditorOrAdmin } from "@/lib/auth";
import { productFormSchema } from "@/validations/product";

export async function saveProduct(input: unknown) {
  await requireEditorOrAdmin();
  const payload = productFormSchema.parse(input);

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/produtos");

  return { success: true, payload };
}
