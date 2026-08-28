import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  purchaseType: z.enum(["unit", "pair"]),
  quantity: z.number().int().min(1).max(100)
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(30),
  paymentMethod: z.enum(["pix", "card"]),
  shippingServiceId: z.number().int().positive(),
  customer: z.object({
    fullName: z.string().trim().min(3).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().min(10).max(24),
    document: z.string().min(11).max(24),
    postalCode: z.string().min(8).max(12),
    street: z.string().trim().min(3).max(160),
    number: z.string().trim().min(1).max(20),
    complement: z.string().trim().max(100).optional(),
    neighborhood: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().length(2),
    notes: z.string().trim().max(1000).optional(),
    acceptedTerms: z.literal(true)
  })
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
