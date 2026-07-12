export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Pedidos</p>
        <h1 className="mt-2 font-serif text-4xl">Pedido {params.id}</h1>
      </div>
      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
        <p className="text-sm leading-7 text-stone-600">
          Estrutura pronta para exibir cliente, endereço, itens, pagamentos, histórico e alteração de status operacional.
        </p>
      </div>
    </div>
  );
}
