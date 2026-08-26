import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getAdminDashboardData } from "@/lib/admin-data";
import { getFulfillmentStatus, getPaymentStatus } from "@/lib/order-status";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();
  const metrics = [
    { label: "Produtos ativos", value: String(dashboard.activeProducts) },
    { label: "Produtos inativos", value: String(dashboard.inactiveProducts) },
    { label: "Estoque baixo", value: String(dashboard.lowStock) },
    { label: "Pedidos pendentes", value: String(dashboard.pendingOrders) },
    { label: "Pedidos aprovados", value: String(dashboard.approvedOrders) },
    { label: "Vendas do mês", value: formatCurrency(dashboard.monthSales) }
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Dashboard</p>
        <h1 className="mt-2 font-serif text-4xl">Visão geral</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6" key={metric.label}>
            <p className="text-sm text-stone-500">{metric.label}</p>
            <p className="mt-4 text-3xl font-medium text-graphite">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-3xl">Últimos pedidos</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-stone-500"><tr><th className="pb-3">Pedido</th><th className="pb-3">Cliente</th><th className="pb-3">Pagamento</th><th className="pb-3">Status</th><th className="pb-3">Total</th></tr></thead>
            <tbody>
              {dashboard.recentOrders.map((order) => {
                const payment = getPaymentStatus(order.payment_status);
                const fulfillment = getFulfillmentStatus(order.fulfillment_status);
                return <tr className="border-t border-stone-100" key={order.id}>
                  <td className="py-4"><Link className="underline" href={`/admin/pedidos/${order.id}`}>{order.order_number}</Link></td>
                  <td className="py-4">{order.customer_name}</td><td className="py-4"><Badge tone={payment.tone}>{payment.label}</Badge></td>
                  <td className="py-4"><Badge tone={fulfillment.tone}>{fulfillment.label}</Badge></td><td className="py-4">{formatCurrency(Number(order.total))}</td>
                </tr>;
              })}
              {dashboard.recentOrders.length === 0 ? <tr><td className="py-6 text-stone-500" colSpan={5}>Ainda não há pedidos.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
