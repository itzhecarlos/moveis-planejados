export const MAX_SHIPPING_DELIVERY_DAYS = 15;

export type ShippingQuote = {
  postalCode: string;
  destinationState: string;
  quotedAmount: number;
  chargedAmount: number;
  freeShipping: boolean;
  deliveryDays: number;
  serviceName: string;
  carrierName: string;
  source: "melhor-envio";
};
