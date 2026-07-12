"use client";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartStore } from "@/stores/cart-store";

export function CheckoutShell() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <CheckoutForm />
      <OrderSummary items={items} />
    </div>
  );
}
