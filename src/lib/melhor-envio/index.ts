import "server-only";

import { roundCurrency } from "@/lib/checkout/pricing";
import { getMelhorEnvioAccessToken } from "@/lib/melhor-envio/oauth";

type MelhorEnvioRate = {
  id?: number;
  name?: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
  company?: { name?: string };
  error?: string;
};

export type MelhorEnvioProduct = {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insuranceValue: number;
  quantity: number;
};

export type MelhorEnvioQuote = {
  amount: number;
  deliveryDays: number;
  serviceName: string;
  carrierName: string;
  serviceId: number | null;
};

export async function calculateMelhorEnvioShipping(params: { destinationPostalCode: string; products: MelhorEnvioProduct[] }): Promise<MelhorEnvioQuote> {
  const accessToken = await getMelhorEnvioAccessToken();
  const originPostalCode = onlyDigits(process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || "");
  if (!accessToken || originPostalCode.length !== 8) throw new Error("O Melhor Envio ainda não está configurado. Informe o token de acesso e o CEP de origem.");

  const baseUrl = (process.env.MELHOR_ENVIO_API_URL || "https://melhorenvio.com.br").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": process.env.MELHOR_ENVIO_USER_AGENT || "Atlas Moveis (contato@atlasmoveis.com.br)"
    },
    body: JSON.stringify({
      from: { postal_code: originPostalCode },
      to: { postal_code: params.destinationPostalCode },
      products: params.products.map((product) => ({
        id: product.id, width: product.width, height: product.height, length: product.length,
        weight: product.weight, insurance_value: product.insuranceValue, quantity: product.quantity
      })),
      options: { receipt: false, own_hand: false }
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
  });
  const rates = (await response.json().catch(() => [])) as MelhorEnvioRate[];
  if (!response.ok) {
    console.error("Melhor Envio shipping calculation failed", { status: response.status, rates });
    throw new Error("Não foi possível calcular o frete no Melhor Envio.");
  }
  const selected = rates
    .map((rate) => ({ ...rate, amount: Number(rate.custom_price || rate.price) }))
    .filter((rate) => !rate.error && Number.isFinite(rate.amount) && rate.amount >= 0)
    .sort((a, b) => a.amount - b.amount)[0];
  if (!selected) throw new Error("Nenhuma modalidade de entrega está disponível para este CEP.");

  return {
    amount: roundCurrency(selected.amount),
    deliveryDays: Number(selected.custom_delivery_time || selected.delivery_time || 0),
    serviceName: selected.name || "Entrega",
    carrierName: selected.company?.name || "Melhor Envio",
    serviceId: selected.id || null
  };
}

export function parseProductDimensions(dimensions: string | null) {
  const match = dimensions?.match(/L\s*(\d+(?:[.,]\d+)?)\s*x\s*A\s*(\d+(?:[.,]\d+)?)\s*x\s*P\s*(\d+(?:[.,]\d+)?)/i);
  if (!match) return null;
  const [width, height, length] = match.slice(1).map((value) => Number(value.replace(",", ".")));
  return [width, height, length].every((value) => Number.isFinite(value) && value > 0) ? { width, height, length } : null;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
