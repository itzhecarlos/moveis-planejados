import Link from "next/link";

import { getAdminProducts } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  return <div className="space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Produtos</p><h1 className="mt-2 font-serif text-4xl">Produtos</h1></div><Link className="rounded-full bg-graphite px-5 py-3 text-sm text-white" href="/admin/produtos/novo">Novo produto</Link></div>
    <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="px-6 py-4">Nome</th><th className="px-6 py-4">SKU</th><th className="px-6 py-4">Categoria</th><th className="px-6 py-4">Preço</th><th className="px-6 py-4">Estoque</th><th className="px-6 py-4">Situação</th><th className="px-6 py-4">Ações</th></tr></thead><tbody>
      {products.map((product) => <tr className="border-t border-stone-100" key={product.id}><td className="px-6 py-4">{product.name}</td><td className="px-6 py-4">{product.sku}</td><td className="px-6 py-4">{product.categories?.[0]?.slug || "—"}</td><td className="px-6 py-4">{formatCurrency(Number(product.unit_price))}</td><td className="px-6 py-4">{product.stock_quantity}</td><td className="px-6 py-4">{product.active && !product.archived_at && !product.deleted_at ? "Ativo" : "Inativo"}</td><td className="px-6 py-4"><Link className="underline" href={`/admin/produtos/${product.id}`}>Editar</Link></td></tr>)}
      {products.length === 0 ? <tr><td className="px-6 py-6 text-stone-500" colSpan={7}>Nenhum produto cadastrado no banco.</td></tr> : null}
    </tbody></table></div>
  </div>;
}
