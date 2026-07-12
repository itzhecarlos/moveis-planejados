import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductGrid } from "@/components/products/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { href: "/produtos", label: "Produtos" }, { label: category.name }]} />
        <div className="grid gap-6 rounded-[2rem] border border-stone-200 bg-white p-8 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="divider-line" />
            <h1 className="font-serif text-4xl sm:text-5xl">{category.name}</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-600">{category.description}</p>
          </div>
          <div className="grid gap-3 text-sm text-stone-500 sm:grid-cols-2 lg:min-w-[340px]">
            <div className="rounded-2xl border border-stone-200 p-4">Ordenação: Destaques</div>
            <div className="rounded-2xl border border-stone-200 p-4">Disponibilidade: Todos</div>
            <div className="rounded-2xl border border-stone-200 p-4">Cor: Todas</div>
            <div className="rounded-2xl border border-stone-200 p-4">Faixa de preço: Livre</div>
          </div>
        </div>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState description="Essa categoria ainda não possui itens publicados." title="Nenhum produto encontrado" />
        )}
      </div>
    </section>
  );
}
