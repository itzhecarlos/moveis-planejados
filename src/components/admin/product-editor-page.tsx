import { getCategories, getProducts } from "@/lib/catalog";

export function ProductEditorPage({ mode, productId }: { mode: "create" | "edit"; productId?: string }) {
  const product = getProducts().find((entry) => entry.id === productId);
  const categories = getCategories();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Produtos</p>
        <h1 className="mt-2 font-serif text-4xl">{mode === "create" ? "Novo produto" : `Editar ${product?.name || "produto"}`}</h1>
      </div>
      <div className="grid gap-4 rounded-[1.75rem] border border-stone-200 bg-white p-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Nome
          <input className="rounded-2xl border border-stone-200 px-4 py-3" defaultValue={product?.name} />
        </label>
        <label className="grid gap-2 text-sm">
          Slug
          <input className="rounded-2xl border border-stone-200 px-4 py-3" defaultValue={product?.slug} />
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          Categoria
          <select className="rounded-2xl border border-stone-200 px-4 py-3" defaultValue={product?.categorySlug}>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          Descrição curta
          <textarea className="min-h-28 rounded-2xl border border-stone-200 px-4 py-3" defaultValue={product?.shortDescription} />
        </label>
      </div>
    </div>
  );
}
