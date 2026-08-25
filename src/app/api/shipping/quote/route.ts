import { NextResponse } from "next/server";
import { z } from "zod";

import { quoteShippingForCart } from "@/lib/server/shipping";
import { checkoutItemSchema } from "@/validations/checkout";

const shippingQuoteSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  postalCode: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.string().length(8)),
  state: z.string().trim().length(2)
});

export async function POST(request: Request) {
  try {
    const payload = shippingQuoteSchema.parse(await request.json());
    const quote = await quoteShippingForCart(payload.items, payload.postalCode, payload.state);

    return NextResponse.json(quote);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível calcular o frete.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
