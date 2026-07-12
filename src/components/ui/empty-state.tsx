export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">{description}</p>
    </div>
  );
}
