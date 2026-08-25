"use server";

import { revalidatePath } from "next/cache";

import { requireEditorOrAdmin } from "@/lib/auth";
import { categorySchema } from "@/validations/category";

export async function saveCategory(input: unknown) {
  await requireEditorOrAdmin();
  const payload = categorySchema.parse(input);
  revalidatePath("/");
  revalidatePath("/produtos");
  return { success: true, payload };
}
