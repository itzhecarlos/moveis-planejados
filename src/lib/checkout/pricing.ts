export const PIX_DISCOUNT_RATE = 0.05;
export const DEFAULT_SHIPPING_AMOUNT = 149;
export const FREE_SHIPPING_STATES = ["PR", "SC", "RS"] as const;

export function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

export function normalizeBrazilState(value: string) {
  return value.trim().toUpperCase().slice(0, 2);
}

export function calculateShippingAmount(state: string) {
  return FREE_SHIPPING_STATES.includes(normalizeBrazilState(state) as (typeof FREE_SHIPPING_STATES)[number])
    ? 0
    : DEFAULT_SHIPPING_AMOUNT;
}
