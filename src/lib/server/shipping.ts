import "server-only";

import { calculateShippingAmount, normalizeBrazilState } from "@/lib/checkout/pricing";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MAX_SHIPPING_DELIVERY_DAYS, type ShippingQuote } from "@/lib/shipping/types";
import type { CartItem } from "@/types";

type QuoteShippingInput = {
  postalCode: string;
  state: string;
  products: Array<{ id: string }>;
};

/**
 * Fixed-price shipping rule. Shipping is still calculated on the server; no
 * carrier token, weight, or dimensions supplied by a browser are trusted.
 */
export async function quoteShippingForCart(items: CartItem[], postalCode: string, state: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("O Supabase não está configurado para calcular o frete.");

  const productIds = [...new Set(items.map((item) => item.productId))];
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .in("id", productIds)
    .eq("active", true)
    .is("archived_at", null)
    .is("deleted_at", null);

  if (error || (data || []).length !== productIds.length) {
    throw new Error("Existe um produto indisponível no carrinho.");
  }

  return quoteShipping({ postalCode, state, products: data || [] });
}

export async function quoteShipping({ postalCode, state, products }: QuoteShippingInput): Promise<ShippingQuote> {
  const destinationPostalCode = onlyDigits(postalCode);
  const destinationState = normalizeBrazilState(state);

  if (destinationPostalCode.length !== 8) throw new Error("Informe um CEP válido para calcular o frete.");
  if (destinationState.length !== 2) throw new Error("Informe uma UF válida para calcular o frete.");
  if (!products.length) throw new Error("O carrinho está vazio.");

  const chargedAmount = calculateShippingAmount(destinationState);
  const freeShipping = chargedAmount === 0;

  return {
    postalCode: destinationPostalCode,
    destinationState,
    quotedAmount: chargedAmount,
    chargedAmount,
    freeShipping,
    deliveryDays: MAX_SHIPPING_DELIVERY_DAYS,
    serviceName: "Entrega padrão",
    carrierName: "A definir após a compra",
    source: "fixed"
  };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
