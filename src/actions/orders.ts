"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fulfillmentStatusSchema } from "@/validations/order";

const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: fulfillmentStatusSchema.extract(["in_production", "shipped", "in_transit"])
});

export async function updateOrderFulfillmentStatus(input: unknown) {
  const { user } = await requireAdminRole();
  const payload = updateOrderStatusSchema.parse(input);
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase administrativo não está configurado.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("fulfillment_status, payment_status")
    .eq("id", payload.orderId)
    .maybeSingle();
  if (orderError || !order) throw new Error("Pedido não encontrado.");
  if (order.payment_status !== "approved") throw new Error("O status operacional só pode ser alterado após a confirmação do pagamento.");

  const { error: updateError } = await supabase
    .from("orders")
    .update({ fulfillment_status: payload.status })
    .eq("id", payload.orderId)
    .eq("payment_status", "approved");
  if (updateError) throw new Error("Não foi possível atualizar o status operacional.");

  await Promise.all([
    supabase.from("order_status_history").insert({
      order_id: payload.orderId,
      previous_status: order.fulfillment_status,
      new_status: payload.status,
      changed_by: user.id
    }),
    supabase.from("admin_audit_logs").insert({
      user_id: user.id,
      action: "order_fulfillment_status_updated",
      entity_type: "order",
      entity_id: payload.orderId,
      previous_data: { fulfillment_status: order.fulfillment_status },
      new_data: { fulfillment_status: payload.status }
    })
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${payload.orderId}`);
  revalidatePath("/admin/auditoria");
  return { success: true };
}
