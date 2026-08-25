import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  PIX_DISCOUNT_RATE,
  normalizeBrazilState,
  roundCurrency
} from "@/lib/checkout/pricing";
import { quoteShipping } from "@/lib/server/shipping";
import type { CheckoutInput } from "@/validations/checkout";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  unit_price: number;
  pair_price: number | null;
  promotional_price: number | null;
  dimensions: string | null;
  weight: number | null;
  track_stock: boolean;
  stock_quantity: number;
};

type VariantRow = {
  id: string;
  product_id: string;
  color_id: string | null;
  sku: string | null;
  name: string;
  price_adjustment: number;
  stock_quantity: number;
  active: boolean;
};

type ColorRow = {
  id: string;
  product_id: string;
  name: string;
};

type CanonicalCheckoutItem = {
  product: ProductRow;
  variant: VariantRow | null;
  color: ColorRow | null;
  quantity: number;
  purchaseType: "unit" | "pair";
  unitPrice: number;
  total: number;
};

export async function createPendingOrderFromCheckout(
  payload: CheckoutInput,
  context?: {
    ip?: string | null;
    userId?: string | null;
    userAgent?: string | null;
  }
) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase não está configurado para validar preços e salvar pedidos com segurança.");
  }

  const productIds = [...new Set(payload.items.map((item) => item.productId))];

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, slug, sku, unit_price, pair_price, promotional_price, dimensions, weight, track_stock, stock_quantity")
    .in("id", productIds)
    .eq("active", true)
    .is("archived_at", null)
    .is("deleted_at", null);

  if (productsError) {
    throw new Error("Não foi possível validar os produtos no banco de dados.");
  }

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, color_id, sku, name, price_adjustment, stock_quantity, active")
    .in("product_id", productIds)
    .eq("active", true);

  if (variantsError) {
    throw new Error("Não foi possível validar as variantes no banco de dados.");
  }

  const colorIds = [...new Set((variants || []).map((variant) => variant.color_id).filter(Boolean))] as string[];
  const { data: colors, error: colorsError } = colorIds.length
    ? await supabase.from("product_colors").select("id, product_id, name").in("id", colorIds).eq("active", true)
    : { data: [], error: null };

  if (colorsError) {
    throw new Error("Não foi possível validar as cores no banco de dados.");
  }

  const productMap = new Map((products as ProductRow[]).map((product) => [product.id, product]));
  const variantsByProduct = new Map<string, VariantRow[]>();
  const colorMap = new Map((colors as ColorRow[]).map((color) => [color.id, color]));

  for (const variant of (variants as VariantRow[]) || []) {
    const current = variantsByProduct.get(variant.product_id) || [];
    current.push(variant);
    variantsByProduct.set(variant.product_id, current);
  }

  const canonicalItems: CanonicalCheckoutItem[] = payload.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error("Produto inválido ou indisponível.");
    }

    const availableVariants = variantsByProduct.get(product.id) || [];
    if (item.variantId && !availableVariants.some((entry) => entry.id === item.variantId)) {
      throw new Error("A variante selecionada nao esta disponivel.");
    }
    if (!item.variantId && availableVariants.length > 0) {
      throw new Error("Selecione uma variante para este produto.");
    }
    const variant =
      availableVariants.find((entry) => entry.id === item.variantId) ||
      availableVariants[0] ||
      null;

    if (item.variantId && !variant) {
      throw new Error(`A variação selecionada para ${product.name} não está disponível.`);
    }

    const color = variant?.color_id ? colorMap.get(variant.color_id) || null : null;
    if (variant?.color_id && (!color || color.product_id !== product.id)) {
      throw new Error("A cor selecionada nao pertence ao produto.");
    }

    const basePrice =
      item.purchaseType === "pair" && product.pair_price ? product.pair_price : product.promotional_price || product.unit_price;
    const variantAdjustment = variant?.price_adjustment || 0;
    const unitPrice = roundCurrency(basePrice + variantAdjustment);
    const total = roundCurrency(unitPrice * item.quantity);
    const availableStock = variant?.stock_quantity ?? product.stock_quantity;

    if (product.track_stock && availableStock < item.quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}.`);
    }

    return {
      product,
      variant,
      color,
      quantity: item.quantity,
      purchaseType: item.purchaseType,
      unitPrice,
      total
    };
  });

  const subtotal = roundCurrency(canonicalItems.reduce((acc, item) => acc + item.total, 0));
  const pixDiscount = payload.paymentMethod === "pix" ? roundCurrency(subtotal * PIX_DISCOUNT_RATE) : 0;
  const shippingQuote = await quoteShipping({
    postalCode: payload.customer.postalCode,
    state: payload.customer.state,
    products: canonicalItems.map((item) => {
      const physicalQuantity = item.quantity * (item.purchaseType === "pair" ? 2 : 1);

      return {
        id: `${item.product.id}-${item.purchaseType}`,
        dimensions: item.product.dimensions,
        weight: item.product.weight,
        insuranceValue: roundCurrency(item.total / physicalQuantity),
        quantity: physicalQuantity
      };
    })
  });
  const shipping = shippingQuote.chargedAmount;
  const total = roundCurrency(subtotal - pixDiscount + shipping);
  const normalizedState = normalizeBrazilState(payload.customer.state);
  const orderNumber = buildOrderNumber();

  const pricingSnapshot = {
    source: "supabase",
    rules: {
      pixDiscountRate: PIX_DISCOUNT_RATE,
      freeShippingStates: ["PR", "SC", "RS"],
      shippingProvider: "melhor-envio",
      maximumDeliveryDays: 15
    },
    shippingQuote,
    items: canonicalItems.map((item) => ({
      productId: item.product.id,
      variantId: item.variant?.id || null,
      purchaseType: item.purchaseType,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total
    }))
  };

  const orderPayload = {
      order_number: orderNumber,
      customer_name: payload.customer.fullName,
      customer_email: payload.customer.email,
      customer_phone: payload.customer.phone,
      customer_document: payload.customer.document,
      postal_code: payload.customer.postalCode,
      street: payload.customer.street,
      number: payload.customer.number,
      complement: payload.customer.complement || null,
      neighborhood: payload.customer.neighborhood,
      city: payload.customer.city,
      state: normalizedState,
      notes: payload.customer.notes || null,
      subtotal,
      pix_discount: pixDiscount,
      shipping,
      total,
      payment_status: "pending",
      fulfillment_status: "awaiting_payment",
      payment_method: payload.paymentMethod,
      currency_code: "BRL",
      pricing_source: "supabase",
      pricing_snapshot: pricingSnapshot,
      customer_ip: context?.ip?.split(",")[0]?.trim() || null,
      customer_user_id: context?.userId || null,
      customer_user_agent: context?.userAgent || null
    };

  const orderItemsPayload = canonicalItems.map((item) => ({
    product_id: item.product.id,
    variant_id: item.variant?.id || null,
    product_name: item.product.name,
    product_sku: item.variant?.sku || item.product.sku,
    variation_name: item.variant?.name || null,
    color_name: item.color?.name || null,
    purchase_type: item.purchaseType,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.total
  }));

  const { data: createdOrder, error: orderError } = await supabase.rpc("create_checkout_order", {
    p_order: orderPayload,
    p_items: orderItemsPayload
  });
  const order = Array.isArray(createdOrder) ? createdOrder[0] : createdOrder;

  if (orderError || !order) {
    throw new Error("Não foi possível criar o pedido com segurança no banco de dados.");
  }

  const orderItemsError = null;

  if (orderItemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error("Não foi possível salvar os itens do pedido com segurança.");
  }

  return {
    id: order.id,
    orderNumber,
    subtotal,
    pixDiscount,
    shipping,
    total,
    paymentMethod: payload.paymentMethod,
    customer: {
      fullName: payload.customer.fullName,
      email: payload.customer.email,
      phone: payload.customer.phone,
      document: payload.customer.document,
      postalCode: payload.customer.postalCode,
      street: payload.customer.street,
      number: payload.customer.number,
      complement: payload.customer.complement || null,
      neighborhood: payload.customer.neighborhood,
      city: payload.customer.city,
      state: normalizedState
    },
    items: canonicalItems.map((item) => ({
      productId: item.product.id,
      title: item.product.name,
      description: item.purchaseType === "pair" ? "Compra em par" : "Compra unitária",
      sku: item.variant?.sku || item.product.sku,
      quantity: item.quantity,
      purchaseType: item.purchaseType,
      unitPrice: item.unitPrice,
      total: item.total
    }))
  };
}

export async function attachPreferenceToOrder(orderId: string, preferenceId: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return;

  await supabase.from("orders").update({ mercado_pago_preference_id: preferenceId }).eq("id", orderId);
}

function buildOrderNumber() {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const random = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `ATL-${stamp}-${random}`;
}
