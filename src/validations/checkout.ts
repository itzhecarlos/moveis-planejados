import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  purchaseType: z.enum(["unit", "pair"]),
  quantity: z.number().int().positive()
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  paymentMethod: z.enum(["pix", "card"]),
  customer: z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    document: z.string().min(11),
    postalCode: z.string().min(8),
    street: z.string().min(3),
    number: z.string().min(1),
    complement: z.string().optional(),
    neighborhood: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2).max(2),
    notes: z.string().optional(),
    acceptedTerms: z.literal(true)
  })
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
