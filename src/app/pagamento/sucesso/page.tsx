import { Suspense } from "react";

import { PaymentConfirmation } from "@/components/checkout/payment-confirmation";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentConfirmation />
    </Suspense>
  );
}
