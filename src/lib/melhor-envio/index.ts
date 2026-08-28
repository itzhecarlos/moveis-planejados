import "server-only";

import { roundCurrency } from "@/lib/checkout/pricing";
import { getMelhorEnvioAccessToken } from "@/lib/melhor-envio/oauth";

type Rate = { id?: number; name?: string; price?: string; custom_price?: string; delivery_time?: number; custom_delivery_time?: number; company?: { name?: string }; error?: string };
export type MelhorEnvioProduct = { id: string; width: number; height: number; length: number; weight: number; insuranceValue: number; quantity: number };
export type MelhorEnvioQuote = { amount: number; deliveryDays: number; serviceName: string; carrierName: string; serviceId: number };

export async function calculateMelhorEnvioShipping(params: { destinationPostalCode: string; products: MelhorEnvioProduct[] }): Promise<MelhorEnvioQuote[]> {
  const accessToken = await getMelhorEnvioAccessToken();
  const originPostalCode = onlyDigits(process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || "");
  if (!accessToken || originPostalCode.length !== 8) throw new Error("O Melhor Envio ainda não está configurado. Informe o token de acesso e o CEP de origem.");
  const baseUrl = (process.env.MELHOR_ENVIO_API_URL || "https://melhorenvio.com.br").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "User-Agent": process.env.MELHOR_ENVIO_USER_AGENT || "Atlas Moveis (contato@atlasmoveis.com.br)" },
    body: JSON.stringify({ from: { postal_code: originPostalCode }, to: { postal_code: params.destinationPostalCode }, products: params.products.map((p) => ({ id: p.id, width: p.width, height: p.height, length: p.length, weight: p.weight, insurance_value: p.insuranceValue, quantity: p.quantity })), options: { receipt: false, own_hand: false } }),
    cache: "no-store", signal: AbortSignal.timeout(10_000)
  });
  const rates = (await response.json().catch(() => [])) as Rate[];
  if (!response.ok) { console.error("Melhor Envio shipping calculation failed", { status: response.status, rates }); throw new Error("Não foi possível calcular o frete no Melhor Envio."); }
  const available = rates.map((rate) => ({ ...rate, amount: Number(rate.custom_price || rate.price) }))
    .filter((rate): rate is Rate & { id: number; amount: number } => !rate.error && Number.isFinite(rate.amount) && rate.amount >= 0 && Number.isInteger(rate.id) && (rate.id || 0) > 0)
    .sort((a, b) => a.amount - b.amount);
  if (!available.length) throw new Error("Nenhuma modalidade de entrega está disponível para este CEP.");
  return available.map((rate) => ({ amount: roundCurrency(rate.amount), deliveryDays: Number(rate.custom_delivery_time || rate.delivery_time || 0), serviceName: rate.name || "Entrega", carrierName: rate.company?.name || "Melhor Envio", serviceId: rate.id }));
}

export function parseProductDimensions(dimensions: string | null) {
  const match = dimensions?.match(/L\s*(\d+(?:[.,]\d+)?)\s*x\s*A\s*(\d+(?:[.,]\d+)?)\s*x\s*P\s*(\d+(?:[.,]\d+)?)/i);
  if (!match) return null;
  const [width, height, length] = match.slice(1).map((value) => Number(value.replace(",", ".")));
  return [width, height, length].every((value) => Number.isFinite(value) && value > 0) ? { width, height, length } : null;
}
function onlyDigits(value: string) { return value.replace(/\D/g, ""); }
