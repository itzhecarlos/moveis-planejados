import "server-only";

import { FREE_SHIPPING_STATES, normalizeBrazilState } from "@/lib/checkout/pricing";
import { calculateMelhorEnvioShipping, parseProductDimensions, type MelhorEnvioProduct, type MelhorEnvioQuote } from "@/lib/melhor-envio";
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
  const regionalFreeShipping = FREE_SHIPPING_STATES.includes(destinationState as (typeof FREE_SHIPPING_STATES)[number]);
  const eligibleOptions = regionalFreeShipping ? selectBestCostBenefitOptions(options, 3) : options;
  const selected = selectedServiceId ? eligibleOptions.find((option) => option.serviceId === selectedServiceId) : eligibleOptions[0];
  if (!selected) throw new Error("A modalidade de frete selecionada não está mais disponível. Escolha outra opção.");
  const selectedDeadline = calculateTotalDeliveryDays(selected.deliveryDays);
  const mappedOptions = eligibleOptions.map((option) => {
    const deadline = calculateTotalDeliveryDays(option.deliveryDays);
    return {
      serviceId: option.serviceId,
      quotedAmount: option.amount,
      chargedAmount: regionalFreeShipping ? 0 : option.amount,
      freeShipping: regionalFreeShipping,
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
    chargedAmount: regionalFreeShipping ? 0 : selected.amount,
    freeShipping: regionalFreeShipping,
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

function selectBestCostBenefitOptions(options: MelhorEnvioQuote[], limit: number) {
  if (options.length <= limit) return options;

  const amounts = options.map((option) => option.amount);
  const deliveryDays = options.map((option) => calculateTotalDeliveryDays(option.deliveryDays).carrierDays);
  const minAmount = Math.min(...amounts);
  const maxAmount = Math.max(...amounts);
  const minDays = Math.min(...deliveryDays);
  const maxDays = Math.max(...deliveryDays);

  return options
    .map((option) => {
      const days = calculateTotalDeliveryDays(option.deliveryDays).carrierDays;
      const normalizedCost = maxAmount === minAmount ? 0 : (option.amount - minAmount) / (maxAmount - minAmount);
      const normalizedTime = maxDays === minDays ? 0 : (days - minDays) / (maxDays - minDays);
      return { option, score: normalizedCost * 0.7 + normalizedTime * 0.3 };
    })
    .sort((a, b) => a.score - b.score || a.option.amount - b.option.amount || a.option.deliveryDays - b.option.deliveryDays)
    .slice(0, limit)
    .map(({ option }) => option);
}
