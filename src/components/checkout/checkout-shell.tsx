"use client";

import { useState } from "react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartStore } from "@/stores/cart-store";
import type { PaymentMethod } from "@/types";
import type { CheckoutInput } from "@/validations/checkout";

type CheckoutShellProps = {
  initialCustomer?: CheckoutInput["customer"];
};

export function CheckoutShell({ initialCustomer }: CheckoutShellProps) {
  const items = useCartStore((state) => state.items);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [shippingState, setShippingState] = useState(initialCustomer?.state || "");
  const [shippingPostalCode, setShippingPostalCode] = useState(initialCustomer?.postalCode || "");
  const [shippingServiceId, setShippingServiceId] = useState<number | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <CheckoutForm
        initialCustomer={initialCustomer}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        setShippingPostalCode={setShippingPostalCode}
        setShippingState={setShippingState}
        shippingPostalCode={shippingPostalCode}
        shippingState={shippingState}
        shippingServiceId={shippingServiceId}
      />
      <OrderSummary
        items={items}
        paymentMethod={paymentMethod}
        shippingPostalCode={shippingPostalCode}
        shippingState={shippingState}
        onShippingServiceChange={setShippingServiceId}
      />
    </div>
  );
}
