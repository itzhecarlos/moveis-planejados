import { NextResponse } from "next/server";
import { z } from "zod";

import { quoteShippingForCart } from "@/lib/server/shipping";
import { requestIp, takeRateLimit } from "@/lib/server/rate-limit";
import { checkoutItemSchema } from "@/validations/checkout";

const shippingQuoteSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  postalCode: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.string().length(8)),
  state: z.string().trim().length(2)
});

export async function POST(request: Request) {
  try {
    const limit = takeRateLimit(`shipping:${requestIp(request)}`, 20, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Muitas consultas de frete. Tente novamente em instantes." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }
    const payload = shippingQuoteSchema.parse(await request.json());
    const quote = await quoteShippingForCart(payload.items, payload.postalCode, payload.state);

    return NextResponse.json(quote);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível calcular o frete.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
