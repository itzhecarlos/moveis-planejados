import Link from "next/link";

import { getProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = getProducts();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Produtos</p>
          <h1 className="mt-2 font-serif text-4xl">Produtos</h1>
        </div>
        <Link className="rounded-full bg-graphite px-5 py-3 text-sm text-white" href="/admin/produtos/novo">
          Novo produto
        </Link>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Estoque</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-t border-stone-100" key={product.id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.sku}</td>
                <td className="px-6 py-4">{product.categorySlug}</td>
                <td className="px-6 py-4">{formatCurrency(product.unitPrice)}</td>
                <td className="px-6 py-4">{product.stockQuantity}</td>
                <td className="px-6 py-4">
                  <Link className="text-graphite underline" href={`/admin/produtos/${product.id}`}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
