import { createClient } from "@supabase/supabase-js";

export const config = {
  schedule: "*/15 * * * *"
};

export default async function expirePendingOrders() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Pending-order expiry skipped: Supabase administrative environment variables are missing.");
    return;
  }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: candidates, error } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("payment_status", "pending")
    .eq("fulfillment_status", "awaiting_payment")
    .lt("created_at", cutoff)
    .order("created_at")
    .limit(50);

  if (error) {
    console.error("Pending-order expiry query failed", error);
    return;
  }

  let cancelled = 0;
  for (const order of candidates || []) {
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "cancelled", fulfillment_status: "cancelled" })
      .eq("id", order.id)
      .eq("payment_status", "pending")
      .eq("fulfillment_status", "awaiting_payment")
      .select("id")
      .maybeSingle();

    if (updateError || !updated) {
      if (updateError) console.error("Pending-order cancellation failed", { orderId: order.id, error: updateError });
      continue;
    }

    const { error: releaseError } = await supabase.rpc("release_checkout_reservation", { p_order_id: order.id });
    if (releaseError) console.error("Pending-order stock release failed", { orderId: order.id, error: releaseError });

    await supabase.from("admin_audit_logs").insert({
      action: "order_expired",
      entity_type: "order",
      entity_id: order.id,
      new_data: { order_number: order.order_number, reason: "payment_not_completed_within_24_hours" }
    });
    cancelled += 1;
  }

  console.info("Pending-order expiry completed", { candidates: candidates?.length || 0, cancelled });
}
