export function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="animate-pulse rounded-[1.6rem] border border-stone-200 bg-white p-3" key={index}>
          <div className="aspect-[4/5] rounded-[1.2rem] bg-stone-100" />
          <div className="mt-4 h-5 rounded-full bg-stone-100" />
          <div className="mt-3 h-4 w-2/3 rounded-full bg-stone-100" />
          <div className="mt-2 h-4 w-1/2 rounded-full bg-stone-100" />
        </div>
      ))}
    </div>
  );
}
