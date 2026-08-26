import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getAdminOrder } from "@/lib/admin-data";
import { getFulfillmentStatus, getPaymentStatus } from "@/lib/order-status";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getAdminOrder(params.id);
  if (!order) notFound();

  const payment = getPaymentStatus(order.payment_status);
  const fulfillment = getFulfillmentStatus(order.fulfillment_status);
  const documentLabel = String(order.customer_document || "").replace(/\D/g, "").length > 11 ? "CNPJ" : "CPF";

  return (
    <div className="space-y-8">
      <div><p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Pedidos</p><h1 className="mt-2 font-serif text-4xl">Pedido {order.order_number}</h1></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6"><h2 className="text-xl font-medium">Cliente e dados fiscais</h2><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><Data label="Nome" value={order.customer_name} /><Data label="E-mail" value={order.customer_email} /><Data label="Telefone" value={order.customer_phone} /><Data label={documentLabel} value={order.customer_document} /></dl><h3 className="mt-7 text-base font-medium">Endereço de entrega</h3><p className="mt-3 text-sm leading-7 text-stone-600">{order.street}, {order.number}{order.complement ? ` — ${order.complement}` : ""}<br />{order.neighborhood} · {order.city}/{order.state}<br />CEP {order.postal_code}</p>{order.notes ? <p className="mt-4 border-t border-stone-100 pt-4 text-sm text-stone-600"><strong>Observações:</strong> {order.notes}</p> : null}</section>
        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6"><h2 className="text-xl font-medium">Pagamento e operação</h2><div className="mt-5 grid gap-5"><div><p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">Pagamento</p><Badge tone={payment.tone}>{payment.label}</Badge></div><div><p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">Andamento do pedido</p><Badge tone={fulfillment.tone}>{fulfillment.label}</Badge></div><Data label="Método" value={order.payment_method === "pix" ? "Pix" : order.payment_method || "Não informado"} /><div className="border-t border-stone-100 pt-5"><p className="text-xs uppercase tracking-[0.2em] text-stone-500">Total do pedido</p><p className="mt-2 text-3xl font-medium">{formatCurrency(Number(order.total))}</p><p className="mt-2 text-sm text-stone-500">Produtos {formatCurrency(Number(order.subtotal))} · Frete {formatCurrency(Number(order.shipping))}</p></div></div></section>
      </div>
      <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6"><h2 className="text-xl font-medium">Itens</h2><div className="mt-4 space-y-3">{(order.order_items || []).map((item: { id: string; quantity: number; product_name: string; product_sku: string | null; variation_name: string | null; color_name: string | null; purchase_type: string; total_price: number }) => <div className="flex flex-wrap justify-between gap-4 border-t border-stone-100 pt-4" key={item.id}><div><p>{item.quantity}× {item.product_name}</p><p className="mt-1 text-sm text-stone-500">{[item.purchase_type === "pair" ? "Par" : "Unitário", item.variation_name, item.color_name, item.product_sku ? `SKU ${item.product_sku}` : null].filter(Boolean).join(" · ")}</p></div><strong>{formatCurrency(Number(item.total_price))}</strong></div>)}</div></section>
    </div>
  );
}

function Data({ label, value }: { label: string; value: string | null | undefined }) {
  return <div><dt className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</dt><dd className="mt-1 break-words text-stone-800">{value || "Não informado"}</dd></div>;
}
