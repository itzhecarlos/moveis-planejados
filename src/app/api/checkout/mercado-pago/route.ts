import { NextResponse } from "next/server";

import { getProducts } from "@/lib/catalog";
import { createPreference } from "@/lib/mercado-pago";
import { formatCurrency } from "@/lib/utils";
import { checkoutSchema } from "@/validations/checkout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = checkoutSchema.parse(body);

    const products = getProducts();
    const items = payload.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        throw new Error("Produto inválido.");
      }

      const variant = product.variants.find((entry) => entry.id === item.variantId) || product.variants[0];
      const unitPrice =
        item.purchaseType === "pair" && product.pairPrice ? product.pairPrice : product.promotionalPrice || product.unitPrice;

      if (product.trackStock && variant && variant.stockQuantity < item.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}.`);
      }

      return {
        product,
        variant,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const shipping = subtotal > 2500 ? 0 : 149;
    const total = subtotal + shipping;
    const orderNumber = `ATL-${Date.now()}`;

    const preference = await createPreference(orderNumber, total);

    return NextResponse.json({
      init_point: preference.init_point,
      order_number: orderNumber,
      totals: {
        subtotal: formatCurrency(subtotal),
        shipping: formatCurrency(shipping),
        total: formatCurrency(total)
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado ao processar checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
