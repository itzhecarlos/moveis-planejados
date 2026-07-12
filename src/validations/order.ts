import { z } from "zod";

export const fulfillmentStatusSchema = z.enum([
  "awaiting_payment",
  "payment_confirmed",
  "in_production",
  "ready_for_shipping",
  "shipped",
  "delivered",
  "cancelled"
]);
