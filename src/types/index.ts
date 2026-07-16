export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  displayOrder: number;
};

export type ProductColor = {
  id: string;
  name: string;
  slug: string;
  hexColor: string;
  active: boolean;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  priceAdjustment: number;
  stockQuantity: number;
  active: boolean;
  colorId?: string;
};

export type ProductImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  isPrimary?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  unitPrice: number;
  pairPrice?: number;
  promotionalPrice?: number;
  dimensions: string;
  weight: number;
  materials: string;
  warranty: string;
  productionTime: string;
  stockQuantity: number;
  trackStock: boolean;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  colors: ProductColor[];
  variants: ProductVariant[];
  images: ProductImage[];
};

export type PurchaseType = "unit" | "pair";

export type PaymentMethod = "pix" | "card";

export type CartItem = {
  productId: string;
  variantId?: string;
  colorId?: string;
  purchaseType: PurchaseType;
  quantity: number;
};

export type OrderStatus =
  | "awaiting_payment"
  | "payment_confirmed"
  | "in_production"
  | "ready_for_shipping"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";
