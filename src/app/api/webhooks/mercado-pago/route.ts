import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

import { fetchMercadoPagoPayment } from "@/lib/mercado-pago";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    provider: "mercado-pago"
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const payload = await request.json().catch(() => null);
  const dataId = getDataId(payload, url);

  if (!isValidWebhookSignature(request, dataId)) {
    return NextResponse.json({ ok: false, error: "Assinatura inválida." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      received: true,
      provider: "mercado-pago",
      note: "Webhook recebido, mas o Supabase não está configurado no ambiente."
    });
  }

  const paymentId = dataId || payload?.id;
  const providerEventId = String(paymentId || payload?.action || payload?.type || randomUUID());
  const eventType = String(payload?.type || payload?.action || url.searchParams.get("topic") || "unknown");

  let paymentStatus = String(payload?.status || "pending");
  let externalReference: string | null = payload?.external_reference || null;
  let preferenceId: string | null = payload?.preference_id || null;
  let paymentMethodId: string | null = payload?.payment_method_id || null;
  let paymentTypeId: string | null = payload?.payment_type_id || null;

  if (paymentId && process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    const payment = await fetchMercadoPagoPayment(String(paymentId)).catch(() => null);

    if (payment) {
      paymentStatus = payment.status || paymentStatus;
      externalReference = payment.external_reference || externalReference;
      preferenceId = payment.preference_id || preferenceId;
      paymentMethodId = payment.payment_method_id || paymentMethodId;
      paymentTypeId = payment.payment_type_id || paymentTypeId;
    }
  }

  let orderId: string | null = null;

  if (externalReference) {
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", externalReference)
      .maybeSingle();

    orderId = order?.id || null;
  }

  await supabase.from("payment_events").upsert(
    {
      order_id: orderId,
      provider: "mercado-pago",
      provider_event_id: providerEventId,
      event_type: eventType,
      status: paymentStatus,
      payload: {
        notification: payload,
        resolved: {
          payment_id: paymentId ? String(paymentId) : null,
          external_reference: externalReference,
          preference_id: preferenceId,
          payment_method_id: paymentMethodId,
          payment_type_id: paymentTypeId
        }
      },
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

function getDataId(payload: any, url: URL) {
  return payload?.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id") || null;
}

function isValidWebhookSignature(request: Request, dataId: string | null) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!secret) return true;

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId || !dataId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => {
      const [key, ...rest] = part.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
  );

  const ts = parts.ts;
  const hash = parts.v1;

  if (!ts || !hash) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  return safeCompare(hash, expected);
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
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
