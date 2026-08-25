export default function AdminAuditPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Auditoria</p>
        <h1 className="mt-2 font-serif text-4xl">Auditoria</h1>
      </div>
      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
        <ul className="space-y-4 text-sm text-stone-600">
          <li>Produto Aurora 01 atualizado por admin@example.com</li>
          <li>Estoque da Siena 01 ajustado manualmente</li>
          <li>Status operacional do pedido ATL-2401 alterado para in_production</li>
        </ul>
      </div>
    </div>
  );
}
