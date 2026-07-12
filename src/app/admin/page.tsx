const metrics = [
  { label: "Produtos ativos", value: "10" },
  { label: "Produtos inativos", value: "0" },
  { label: "Estoque baixo", value: "2" },
  { label: "Pedidos pendentes", value: "4" },
  { label: "Pedidos aprovados", value: "18" },
  { label: "Vendas do mês", value: "R$ 22.480" }
];

export default function AdminDashboardPage() {
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
            <thead className="text-stone-500">
              <tr>
                <th className="pb-3">Pedido</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Pagamento</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ATL-2401", "Clara Souza", "approved", "in_production", "R$ 1.699"],
                ["ATL-2400", "Marcos Lima", "pending", "awaiting_payment", "R$ 590"],
                ["ATL-2399", "Julia Paiva", "approved", "ready_for_shipping", "R$ 1.799"]
              ].map((row) => (
                <tr className="border-t border-stone-100" key={row[0]}>
                  {row.map((value) => (
                    <td className="py-4" key={value}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
