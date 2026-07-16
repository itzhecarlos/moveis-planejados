import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { fetchMercadoPagoPayment } from "@/lib/mercado-pago";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      received: true,
      provider: "mercado-pago",
      note: "Webhook recebido, mas o Supabase não está configurado no ambiente."
    });
  }

  const paymentId = payload?.data?.id || payload?.id;
  const providerEventId = String(paymentId || payload?.action || payload?.type || randomUUID());
  const eventType = String(payload?.type || payload?.action || "unknown");

  let paymentStatus = String(payload?.status || "pending");
  let externalReference: string | null = payload?.external_reference || null;
  let preferenceId: string | null = payload?.preference_id || null;

  if (paymentId && process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    const payment = await fetchMercadoPagoPayment(String(paymentId)).catch(() => null);

    if (payment) {
      paymentStatus = payment.status || paymentStatus;
      externalReference = payment.external_reference || externalReference;
      preferenceId = payment.preference_id || preferenceId;
    }
  }

  await supabase.from("payment_events").upsert(
    {
      provider: "mercado-pago",
      provider_event_id: providerEventId,
      event_type: eventType,
      status: paymentStatus,
      payload,
      processed_at: new Date().toISOString()
    },
    {
      onConflict: "provider_event_id",
      ignoreDuplicates: true
    }
  );

  if (externalReference) {
    await supabase
      .from("orders")
      .update({
        payment_status: mapPaymentStatus(paymentStatus),
        fulfillment_status: paymentStatus === "approved" ? "payment_confirmed" : "awaiting_payment",
        mercado_pago_payment_id: paymentId ? String(paymentId) : null,
        mercado_pago_preference_id: preferenceId
      })
      .eq("order_number", externalReference);
  }

  return NextResponse.json({
    ok: true,
    received: true,
    provider: "mercado-pago"
  });
}

function mapPaymentStatus(status: string) {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
    case "charged_back":
      return "charged_back";
    default:
      return "pending";
  }
}
