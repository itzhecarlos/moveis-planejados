export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Pedidos</p>
        <h1 className="mt-2 font-serif text-4xl">Pedidos</h1>
      </div>
      <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-6 py-4">Número</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Operacional</th>
              <th className="px-6 py-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ATL-2401", "Clara Souza", "approved", "in_production", "R$ 1.699"],
              ["ATL-2400", "Marcos Lima", "pending", "awaiting_payment", "R$ 590"]
            ].map((row) => (
              <tr className="border-t border-stone-100" key={row[0]}>
                {row.map((cell) => (
                  <td className="px-6 py-4" key={cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
