import type { BadgeTone } from "@/components/ui/badge";

const paymentStatus: Record<string, { label: string; tone: BadgeTone }> = {
  pending: { label: "Aguardando pagamento", tone: "warning" },
  approved: { label: "Pagamento aprovado", tone: "success" },
  rejected: { label: "Pagamento recusado", tone: "danger" },
  cancelled: { label: "Pagamento cancelado", tone: "default" },
  refunded: { label: "Pagamento estornado", tone: "default" },
  charged_back: { label: "Contestação recebida", tone: "danger" }
};

const fulfillmentStatus: Record<string, { label: string; tone: BadgeTone }> = {
  awaiting_payment: { label: "Aguardando pagamento", tone: "warning" },
  payment_confirmed: { label: "Pagamento confirmado", tone: "success" },
  in_production: { label: "Em preparo", tone: "warning" },
  ready_for_shipping: { label: "Pronto para envio", tone: "success" },
  shipped: { label: "Postado", tone: "success" },
  in_transit: { label: "A caminho", tone: "success" },
  delivered: { label: "Entregue", tone: "success" },
  cancelled: { label: "Pedido cancelado", tone: "default" }
};

export function getPaymentStatus(status: string | null) {
  return paymentStatus[status || ""] || { label: status || "Não informado", tone: "default" as BadgeTone };
}

export function getFulfillmentStatus(status: string | null) {
  return fulfillmentStatus[status || ""] || { label: status || "Não informado", tone: "default" as BadgeTone };
}
