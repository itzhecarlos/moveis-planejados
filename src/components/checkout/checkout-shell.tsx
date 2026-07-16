"use client";

import { useState } from "react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartStore } from "@/stores/cart-store";
import type { PaymentMethod } from "@/types";

export function CheckoutShell() {
  const items = useCartStore((state) => state.items);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <CheckoutForm paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
      <OrderSummary items={items} paymentMethod={paymentMethod} />
    </div>
  );
}
