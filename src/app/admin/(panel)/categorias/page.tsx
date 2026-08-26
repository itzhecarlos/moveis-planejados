import { getAdminCategories } from "@/lib/admin-data";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <div className="space-y-8"><div><p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Categorias</p><h1 className="mt-2 font-serif text-4xl">Categorias</h1></div><div className="grid gap-4 md:grid-cols-2">
    {categories.map((category) => <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6" key={category.id}><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-medium">{category.name}</h2><span className="text-xs text-stone-500">{category.active ? "Ativa" : "Inativa"}</span></div><p className="mt-3 text-sm leading-7 text-stone-600">{category.description || "Sem descrição."}</p><p className="mt-4 text-xs text-stone-500">/{category.slug}</p></div>)}
    {categories.length === 0 ? <p className="text-stone-500">Nenhuma categoria cadastrada no banco.</p> : null}
  </div></div>;
}
