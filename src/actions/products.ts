"use server";

import { revalidatePath } from "next/cache";

import { productFormSchema } from "@/validations/product";

export async function saveProduct(input: unknown) {
  const payload = productFormSchema.parse(input);

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/produtos");

  return { success: true, payload };
}
