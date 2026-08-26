import Link from "next/link";

import { getAdminOrders } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <div className="space-y-8"><div><p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Pedidos</p><h1 className="mt-2 font-serif text-4xl">Pedidos</h1></div><div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="px-6 py-4">Número</th><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Pagamento</th><th className="px-6 py-4">Operacional</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Criado em</th></tr></thead><tbody>
    {orders.map((order) => <tr className="border-t border-stone-100" key={order.id}><td className="px-6 py-4"><Link className="underline" href={`/admin/pedidos/${order.id}`}>{order.order_number}</Link></td><td className="px-6 py-4"><p>{order.customer_name}</p><p className="text-xs text-stone-500">{order.customer_email}</p></td><td className="px-6 py-4">{order.payment_status}</td><td className="px-6 py-4">{order.fulfillment_status}</td><td className="px-6 py-4">{formatCurrency(Number(order.total))}</td><td className="px-6 py-4">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.created_at))}</td></tr>)}
    {orders.length === 0 ? <tr><td className="px-6 py-6 text-stone-500" colSpan={6}>Ainda não há pedidos.</td></tr> : null}
  </tbody></table></div></div>;
}
