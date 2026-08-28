"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "charged_back" | null;

const TERMINAL_STATUSES = new Set<Exclude<PaymentStatus, null>>(["approved", "rejected", "cancelled", "refunded", "charged_back"]);

export function PaymentConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("pedido");
  const [status, setStatus] = useState<PaymentStatus>(null);

  useEffect(() => {
    if (!orderNumber) return;

    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/orders/payment-status?pedido=${encodeURIComponent(orderNumber)}`, { cache: "no-store" });
        const data = await response.json();

        if (active && response.ok) {
          const nextStatus = data.payment_status as PaymentStatus;
          setStatus(nextStatus);
          if (!TERMINAL_STATUSES.has(nextStatus || "pending")) timeoutId = setTimeout(checkStatus, 3_000);
        }
      } catch {
        if (active) timeoutId = setTimeout(checkStatus, 3_000);
      }
    };

    void checkStatus();
    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderNumber]);

  const confirmed = status === "approved";
  const declined = ["rejected", "cancelled", "refunded", "charged_back"].includes(status || "");
  const title = confirmed ? "Pagamento aprovado" : declined ? "Pagamento não aprovado" : "Confirmação de pagamento";
  const description = confirmed
    ? "Recebemos a confirmação do pagamento e enviaremos os próximos passos por e-mail."
    : declined
      ? "O Mercado Pago informou que este pagamento não foi aprovado. Você pode tentar novamente."
      : "Estamos aguardando a confirmação do Mercado Pago. Esta tela será atualizada assim que o webhook for recebido.";

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-soft">
          <SectionHeading align="center" description={description} title={title} />
          <div className="mt-8">
            <Button href={declined ? "/checkout" : "/produtos"}>{declined ? "Tentar novamente" : "Voltar ao catálogo"}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
