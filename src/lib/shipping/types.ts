export const PRODUCTION_TIME_DAYS = 5;
export const FALLBACK_CARRIER_DELIVERY_DAYS = 15;

export function calculateTotalDeliveryDays(carrierDeliveryDays?: number | null) {
  const carrierDays = Number.isFinite(carrierDeliveryDays) && Number(carrierDeliveryDays) > 0
    ? Math.ceil(Number(carrierDeliveryDays))
    : FALLBACK_CARRIER_DELIVERY_DAYS;

  return {
    productionDays: PRODUCTION_TIME_DAYS,
    carrierDays,
    totalDays: PRODUCTION_TIME_DAYS + carrierDays
  };
}

export type ShippingOption = {
  serviceId: number;
  quotedAmount: number;
  deliveryDays: number;
  productionDays: number;
  totalDeliveryDays: number;
  serviceName: string;
  carrierName: string;
};

export type ShippingQuote = {
  postalCode: string;
  destinationState: string;
  quotedAmount: number;
  chargedAmount: number;
  freeShipping: boolean;
  deliveryDays: number;
  productionDays: number;
  totalDeliveryDays: number;
  serviceName: string;
  carrierName: string;
  source: "melhor_envio";
  serviceId: number;
  options: ShippingOption[];
};
