"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateOrderFulfillmentStatus } from "@/actions/orders";
import { Button } from "@/components/ui/button";

const options = [
  { status: "shipped", label: "Postado" },
  { status: "in_transit", label: "A caminho" }
] as const;

export function OrderFulfillmentControls({ orderId, paymentApproved, currentStatus }: { orderId: string; paymentApproved: boolean; currentStatus: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const currentStep = options.findIndex((option) => option.status === currentStatus);
  const operationClosed = ["in_transit", "delivered", "cancelled"].includes(currentStatus);

  function update(status: (typeof options)[number]["status"]) {
    setMessage("");
    startTransition(async () => {
      try {
        await updateOrderFulfillmentStatus({ orderId, status });
        setMessage("Status atualizado.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Não foi possível atualizar o status.");
      }
    });
  }

  return <div className="mt-7 border-t border-stone-100 pt-5"><p className="text-xs uppercase tracking-[0.2em] text-stone-500">Atualizar operação</p><div className="mt-3 flex flex-wrap gap-2">{options.map((option, index) => <Button disabled={!paymentApproved || pending || operationClosed || currentStep >= index} key={option.status} onClick={() => update(option.status)} size="sm" type="button" variant={currentStatus === option.status ? "primary" : "secondary"}>{pending ? <Loader2 aria-hidden className="size-3 animate-spin" /> : null}{option.label}</Button>)}</div>{!paymentApproved ? <p className="mt-3 text-sm text-amber-700">Disponível após a confirmação do pagamento.</p> : null}{operationClosed ? <p className="mt-3 text-sm text-stone-500">Este pedido já avançou para o último estágio disponível.</p> : null}{message ? <p aria-live="polite" className="mt-3 text-sm text-stone-600">{message}</p> : null}</div>;
}
