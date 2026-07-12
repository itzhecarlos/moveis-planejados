"use server";

import { revalidatePath } from "next/cache";

import { categorySchema } from "@/validations/category";

export async function saveCategory(input: unknown) {
  const payload = categorySchema.parse(input);
  revalidatePath("/");
  revalidatePath("/produtos");
  return { success: true, payload };
}
