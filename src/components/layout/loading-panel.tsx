export function LoadingPanel() {
  return (
    <div aria-atomic="true" aria-live="polite" className="fixed inset-0 z-[110] flex items-center justify-center bg-graphite/70 px-6 backdrop-blur-sm" role="status">
      <div className="flex min-w-64 flex-col items-center rounded-[1.75rem] border border-white/15 bg-[#fbf8f3] px-10 py-9 text-center shadow-2xl">
        <span className="relative flex size-14 items-center justify-center" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full border border-stone-400/50 motion-reduce:animate-none" />
          <span className="size-10 animate-spin rounded-full border-[3px] border-stone-300 border-t-graphite motion-reduce:animate-none" />
        </span>
        <span className="mt-5 font-serif text-2xl text-graphite">Carregando a Página...</span>
        <span className="mt-2 text-xs tracking-wide text-stone-500">Estamos preparando tudo para você.</span>
      </div>
    </div>
  );
}
