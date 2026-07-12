"use server";

import { revalidatePath } from "next/cache";

import { fulfillmentStatusSchema } from "@/validations/order";

export async function updateOrderFulfillmentStatus(input: unknown) {
  const payload = fulfillmentStatusSchema.parse(input);
  revalidatePath("/admin/pedidos");
  return { success: true, payload };
}
