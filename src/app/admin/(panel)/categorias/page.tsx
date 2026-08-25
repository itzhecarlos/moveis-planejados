import { getCategories } from "@/lib/catalog";

export default function AdminCategoriesPage() {
  const categories = getCategories();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin / Categorias</p>
        <h1 className="mt-2 font-serif text-4xl">Categorias</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6" key={category.id}>
            <h2 className="text-xl font-medium">{category.name}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
