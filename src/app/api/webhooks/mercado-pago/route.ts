import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

import { fetchMercadoPagoPayment } from "@/lib/mercado-pago";
import { sendApprovedOrderEmail } from "@/lib/resend";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    provider: "mercado-pago"
  });
}

export async function POST(request: Request) {
  if (!process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
    console.error("Mercado Pago webhook rejected: MERCADO_PAGO_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ ok: false, error: "Webhook unavailable." }, { status: 503 });
  }
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("Mercado Pago webhook rejected: access token is not configured.");
    return NextResponse.json({ ok: false, error: "Webhook unavailable." }, { status: 503 });
  }
  const url = new URL(request.url);
  const payload = await request.json().catch(() => null);
  const dataId = getDataId(payload, url);

  if (!isValidWebhookSignature(request, dataId)) {
    return NextResponse.json({ ok: false, error: "Assinatura inválida." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    console.error("Mercado Pago webhook rejected: Supabase administrative client is unavailable.");
    return NextResponse.json({ ok: false, error: "Webhook unavailable." }, { status: 503 });
  }

  const paymentId = dataId || payload?.id;
  let providerEventId = String(paymentId || payload?.action || payload?.type || randomUUID());
  const eventType = String(payload?.type || payload?.action || url.searchParams.get("topic") || "unknown");

  let paymentStatus = "pending";
  let externalReference: string | null = null;
  let preferenceId: string | null = null;
  let paymentMethodId: string | null = null;
  let paymentTypeId: string | null = null;
  let transactionAmount: number | null = null;
  let currencyId: string | null = null;

  if (!paymentId) {
    return NextResponse.json({ ok: false, error: "Payment id is required." }, { status: 400 });
  }
  const payment = await fetchMercadoPagoPayment(String(paymentId)).catch((error) => {
    console.error("Mercado Pago payment lookup failed", error);
    return null;
  });
  if (!payment) {
    return NextResponse.json({ ok: false, error: "Payment could not be verified." }, { status: 502 });
  }
  paymentStatus = payment.status || "pending";
  externalReference = payment.external_reference || null;
  preferenceId = payment.preference_id || null;
  paymentMethodId = payment.payment_method_id || null;
  paymentTypeId = payment.payment_type_id || null;
  transactionAmount = payment.transaction_amount ?? null;
  currencyId = payment.currency_id ?? null;
  // Mercado Pago can notify a payment more than once as it advances through states.
  // The status is included so pending -> approved is not incorrectly discarded as a duplicate.
  providerEventId = `${paymentId}:${paymentStatus}`;

  let orderId: string | null = null;

  if (externalReference) {
    const { data: order } = await supabase
      .from("orders")
      .select("id, total, currency_code, mercado_pago_preference_id, payment_status")
      .eq("order_number", externalReference)
      .maybeSingle();

    orderId = order?.id || null;
    if (!order) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    if (preferenceId && order.mercado_pago_preference_id && preferenceId !== order.mercado_pago_preference_id) {
      console.error("Mercado Pago preference mismatch", { paymentId, externalReference });
      return NextResponse.json({ ok: false, error: "Payment does not match order." }, { status: 400 });
    }
    if (paymentStatus === "approved" && (currencyId !== "BRL" || transactionAmount === null || Number(order.total) !== Number(transactionAmount))) {
      console.error("Mercado Pago amount/currency mismatch", { paymentId, externalReference, transactionAmount, currencyId });
      paymentStatus = "under_review";
    }
  }

  const { error: eventError } = await supabase.from("payment_events").insert(
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
    });

  if (eventError?.code === "23505") return NextResponse.json({ ok: true, received: true, duplicate: true });
  if (eventError) {
    console.error("Mercado Pago event persistence failed", eventError);
    return NextResponse.json({ ok: false, error: "Webhook processing failed." }, { status: 500 });
  }

  if (externalReference && orderId) {
    const nextPaymentStatus = mapPaymentStatus(paymentStatus);
    const updateOrder = supabase
      .from("orders")
      .update({
        payment_status: nextPaymentStatus,
        ...(["refunded", "charged_back"].includes(nextPaymentStatus)
          ? {}
          : { fulfillment_status: nextPaymentStatus === "approved" ? "in_production" : "awaiting_payment" }),
        mercado_pago_payment_id: paymentId ? String(paymentId) : null,
        mercado_pago_preference_id: preferenceId
      })
      .eq("id", orderId);

    if (["refunded", "charged_back"].includes(nextPaymentStatus)) {
      await updateOrder.eq("payment_status", "approved");
    } else {
      await updateOrder.eq("payment_status", "pending");
    }

    if (orderId && ["rejected", "cancelled"].includes(paymentStatus)) {
      const { error: releaseError } = await supabase.rpc("release_checkout_reservation", { p_order_id: orderId });
      if (releaseError) console.error("Failed to release checkout reservation", releaseError);
    }

    if (nextPaymentStatus === "approved") {
      const { data: emailOrder } = await supabase
        .from("orders")
        .select("id, order_number, customer_email, customer_name, total")
        .eq("id", orderId)
        .eq("email_sent", false)
        .maybeSingle();

      if (emailOrder) {
        try {
          const result = await sendApprovedOrderEmail({
            orderNumber: emailOrder.order_number,
            customerEmail: emailOrder.customer_email,
            customerName: emailOrder.customer_name,
            total: formatCurrency(Number(emailOrder.total))
          });
          if (!("skipped" in result) && result.error === null) {
            await supabase.from("orders").update({ email_sent: true }).eq("id", emailOrder.id).eq("email_sent", false);
          }
        } catch (error) {
          console.error("Approved-order email failed", { orderId, error });
        }
      }
    }
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

  if (!secret) return false;

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
  const timestamp = Number(ts);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp * 1000) > 5 * 60 * 1000) return false;

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
    case "under_review":
      return "pending";
    default:
      return "pending";
  }
}
