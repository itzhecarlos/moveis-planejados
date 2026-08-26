import { NextResponse } from "next/server";

import { createPreference } from "@/lib/mercado-pago";
import { createPendingOrderFromCheckout, attachPreferenceToOrder } from "@/lib/server/checkout";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requestIp, takeRateLimit } from "@/lib/server/rate-limit";
import { formatCurrency } from "@/lib/utils";
import { checkoutSchema } from "@/validations/checkout";

export async function POST(request: Request) {
  try {
    const ip = requestIp(request);
    const minuteLimit = takeRateLimit(`checkout:minute:${ip}`, 8, 60_000);
    const hourLimit = takeRateLimit(`checkout:hour:${ip}`, 30, 60 * 60_000);
    if (!minuteLimit.allowed || !hourLimit.allowed) {
      const retryAfter = Math.max(minuteLimit.retryAfterSeconds, hourLimit.retryAfterSeconds);
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em instantes." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
    }
    const body = await request.json();
    const payload = checkoutSchema.parse(body);
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const order = await createPendingOrderFromCheckout(payload, {
      ip,
      userId: user?.id || null,
      userAgent: request.headers.get("user-agent")
    });

    const preference = await createPreference(order);
    await attachPreferenceToOrder(order.id, preference.id);

    const isTestAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.startsWith("TEST-");
    const checkoutUrl = preference.init_point || preference.sandbox_init_point;

    if (!checkoutUrl) {
      throw new Error("O Mercado Pago não retornou um link de pagamento.");
    }

    console.info("Mercado Pago preference created", {
      preferenceId: preference.id,
      environment: isTestAccessToken ? "test" : "production",
      hasInitPoint: Boolean(preference.init_point),
      hasSandboxInitPoint: Boolean(preference.sandbox_init_point),
      checkoutHost: new URL(checkoutUrl).host
    });

    return NextResponse.json({
      init_point: checkoutUrl,
      preference_id: preference.id,
      order_number: order.orderNumber,
      totals: {
        subtotal: formatCurrency(order.subtotal),
        pix_discount: formatCurrency(order.pixDiscount),
        shipping: formatCurrency(order.shipping),
        total: formatCurrency(order.total)
      }
    });
  } catch (error) {
    console.error("Checkout creation failed", error);
    const message = error instanceof Error && /Produto|variante|Estoque|checkout|CEP|UF/.test(error.message)
      ? error.message
      : "NÃ£o foi possÃ­vel processar seu pedido.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
