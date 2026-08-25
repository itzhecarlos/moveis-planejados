"use server";

import { revalidatePath } from "next/cache";

import { requireAdminRole } from "@/lib/auth";
import { fulfillmentStatusSchema } from "@/validations/order";

export async function updateOrderFulfillmentStatus(input: unknown) {
  await requireAdminRole();
  const payload = fulfillmentStatusSchema.parse(input);
  revalidatePath("/admin/pedidos");
  return { success: true, payload };
}
