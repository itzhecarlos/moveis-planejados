import { NextResponse } from "next/server";

import { createPreference } from "@/lib/mercado-pago";
import { createPendingOrderFromCheckout, attachPreferenceToOrder } from "@/lib/server/checkout";
import { formatCurrency } from "@/lib/utils";
import { checkoutSchema } from "@/validations/checkout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = checkoutSchema.parse(body);

    const order = await createPendingOrderFromCheckout(payload, {
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent")
    });

    const preference = await createPreference(order.orderNumber, order.total);
    await attachPreferenceToOrder(order.id, preference.id);

    return NextResponse.json({
      init_point: preference.init_point,
      order_number: order.orderNumber,
      totals: {
        subtotal: formatCurrency(order.subtotal),
        pix_discount: formatCurrency(order.pixDiscount),
        shipping: formatCurrency(order.shipping),
        total: formatCurrency(order.total)
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado ao processar checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
