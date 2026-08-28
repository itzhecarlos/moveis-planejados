import "server-only";

import { normalizeBrazilState } from "@/lib/checkout/pricing";
import { calculateMelhorEnvioShipping, parseProductDimensions, type MelhorEnvioProduct } from "@/lib/melhor-envio";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { calculateTotalDeliveryDays, type ShippingQuote } from "@/lib/shipping/types";
import type { CartItem } from "@/types";

type ProductForQuote = { id: string; dimensions: string | null; weight: number | null; insuranceValue: number; quantity: number };

export async function quoteShippingForCart(items: CartItem[], postalCode: string, state: string, selectedServiceId?: number) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("O Supabase não está configurado para calcular o frete.");
  const ids = [...new Set(items.map((item) => item.productId))];
  const { data, error } = await supabase.from("products").select("id, dimensions, weight, unit_price, promotional_price, pair_price").in("id", ids).eq("active", true).is("archived_at", null).is("deleted_at", null);
  if (error || (data || []).length !== ids.length) throw new Error("Existe um produto indisponível no carrinho.");
  const products: ProductForQuote[] = items.map((item) => {
    const product = (data || []).find((entry) => entry.id === item.productId);
    if (!product) throw new Error("Existe um produto indisponível no carrinho.");
    const price = item.purchaseType === "pair" && product.pair_price ? product.pair_price : product.promotional_price || product.unit_price;
    const quantity = item.quantity * (item.purchaseType === "pair" ? 2 : 1);
    return { id: `${product.id}-${item.purchaseType}`, dimensions: product.dimensions, weight: Number(product.weight), insuranceValue: Number(price) / (item.purchaseType === "pair" ? 2 : 1), quantity };
  });
  return quoteShipping({ postalCode, state, products, selectedServiceId });
}

export async function quoteShipping({ postalCode, state, products, selectedServiceId }: { postalCode: string; state: string; products: ProductForQuote[]; selectedServiceId?: number }): Promise<ShippingQuote> {
  const destinationPostalCode = postalCode.replace(/\D/g, "");
  const destinationState = normalizeBrazilState(state);
  if (destinationPostalCode.length !== 8 || destinationState.length !== 2 || !products.length) throw new Error("Informe endereço e produtos válidos para calcular o frete.");
  const quoteProducts: MelhorEnvioProduct[] = products.map((product) => {
    const dimensions = parseProductDimensions(product.dimensions);
    if (!dimensions || !product.weight || product.weight <= 0) throw new Error("Todos os produtos precisam de dimensões no formato L 50 x A 60 x P 45 cm e peso para calcular o frete.");
    return { id: product.id, ...dimensions, weight: product.weight, insuranceValue: product.insuranceValue, quantity: product.quantity };
  });
  const options = await calculateMelhorEnvioShipping({ destinationPostalCode, products: quoteProducts });
  const selected = selectedServiceId ? options.find((option) => option.serviceId === selectedServiceId) : options[0];
  if (!selected) throw new Error("A modalidade de frete selecionada não está mais disponível. Escolha outra opção.");
  const selectedDeadline = calculateTotalDeliveryDays(selected.deliveryDays);
  const mappedOptions = options.map((option) => {
    const deadline = calculateTotalDeliveryDays(option.deliveryDays);
    return {
      serviceId: option.serviceId,
      quotedAmount: option.amount,
      deliveryDays: deadline.carrierDays,
      productionDays: deadline.productionDays,
      totalDeliveryDays: deadline.totalDays,
      serviceName: option.serviceName,
      carrierName: option.carrierName
    };
  });

  return {
    postalCode: destinationPostalCode,
    destinationState,
    quotedAmount: selected.amount,
    chargedAmount: selected.amount,
    freeShipping: selected.amount === 0,
    deliveryDays: selectedDeadline.carrierDays,
    productionDays: selectedDeadline.productionDays,
    totalDeliveryDays: selectedDeadline.totalDays,
    serviceName: selected.serviceName,
    carrierName: selected.carrierName,
    source: "melhor_envio",
    serviceId: selected.serviceId,
    options: mappedOptions
  };
}
