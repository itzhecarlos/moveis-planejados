export default function Loading() {
  return (
    <div aria-live="polite" className="mx-auto flex min-h-[45vh] max-w-7xl items-center justify-center px-6">
      <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600 shadow-soft">
        <span className="size-3 animate-pulse rounded-full bg-graphite" />
        Carregando página…
      </div>
    </div>
  );
}
