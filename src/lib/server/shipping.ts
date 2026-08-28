import "server-only";

import { normalizeBrazilState } from "@/lib/checkout/pricing";
import { calculateMelhorEnvioShipping, parseProductDimensions, type MelhorEnvioProduct } from "@/lib/melhor-envio";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MAX_SHIPPING_DELIVERY_DAYS, type ShippingQuote } from "@/lib/shipping/types";
import type { CartItem } from "@/types";

type QuoteShippingInput = {
  postalCode: string;
  state: string;
  products: Array<{ id: string; dimensions: string | null; weight: number | null; insuranceValue: number; quantity: number }>;
};

export async function quoteShippingForCart(items: CartItem[], postalCode: string, state: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("O Supabase não está configurado para calcular o frete.");

  const productIds = [...new Set(items.map((item) => item.productId))];
  const { data, error } = await supabase
    .from("products")
    .select("id, dimensions, weight, unit_price, promotional_price, pair_price")
    .in("id", productIds)
    .eq("active", true)
    .is("archived_at", null)
    .is("deleted_at", null);
  if (error || (data || []).length !== productIds.length) throw new Error("Existe um produto indisponível no carrinho.");

  const products = items.map((item) => {
    const product = (data || []).find((entry) => entry.id === item.productId);
    if (!product) throw new Error("Existe um produto indisponível no carrinho.");
    const price = item.purchaseType === "pair" && product.pair_price ? product.pair_price : product.promotional_price || product.unit_price;
    const physicalQuantity = item.quantity * (item.purchaseType === "pair" ? 2 : 1);
    return {
      id: `${product.id}-${item.purchaseType}`,
      dimensions: product.dimensions,
      weight: Number(product.weight),
      insuranceValue: Number(price) / (item.purchaseType === "pair" ? 2 : 1),
      quantity: physicalQuantity
    };
  });

  return quoteShipping({ postalCode, state, products });
}

export async function quoteShipping({ postalCode, state, products }: QuoteShippingInput): Promise<ShippingQuote> {
  const destinationPostalCode = onlyDigits(postalCode);
  const destinationState = normalizeBrazilState(state);
  if (destinationPostalCode.length !== 8) throw new Error("Informe um CEP válido para calcular o frete.");
  if (destinationState.length !== 2) throw new Error("Informe uma UF válida para calcular o frete.");
  if (!products.length) throw new Error("O carrinho está vazio.");

  const quoteProducts: MelhorEnvioProduct[] = products.map((product) => {
    const dimensions = parseProductDimensions(product.dimensions);
    if (!dimensions || !product.weight || product.weight <= 0) {
      throw new Error("Todos os produtos precisam de dimensões no formato L 50 x A 60 x P 45 cm e peso para calcular o frete.");
    }
    return { id: product.id, ...dimensions, weight: product.weight, insuranceValue: product.insuranceValue, quantity: product.quantity };
  });
  const quote = await calculateMelhorEnvioShipping({ destinationPostalCode, products: quoteProducts });

  return {
    postalCode: destinationPostalCode,
    destinationState,
    quotedAmount: quote.amount,
    chargedAmount: quote.amount,
    freeShipping: quote.amount === 0,
    deliveryDays: quote.deliveryDays || MAX_SHIPPING_DELIVERY_DAYS,
    serviceName: quote.serviceName,
    carrierName: quote.carrierName,
    source: "melhor_envio"
  };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
