import { Breadcrumb } from "@/components/layout/breadcrumb";

type LegalSection = { title: string; paragraphs: string[]; bullets?: string[] };
type LegalReference = { label: string; href: string };

export function LegalPage({ title, intro, sections, references = [] }: { title: string; intro: string; sections: LegalSection[]; references?: LegalReference[] }) {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10 sm:space-y-14">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: title }]} />
        <header className="max-w-3xl">
          <span className="divider-line" />
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-stone-500">Informações importantes</p>
          <h1 className="font-serif text-4xl leading-none text-graphite sm:text-5xl">{title}</h1>
          <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">{intro}</p>
        </header>
        <div className="grid max-w-4xl gap-4">
          {sections.map((section, index) => (
            <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 sm:p-8" key={section.title}>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-serif text-2xl text-graphite sm:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-600 sm:text-base">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? <ul className="list-disc space-y-2 pl-5 marker:text-stone-400">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </div>
            </article>
          ))}
        </div>
        {references.length ? <aside className="max-w-4xl rounded-[1.5rem] border border-stone-200 bg-stone-100/70 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-graphite">Referências legais</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-600">
            {references.map((reference) => <li key={reference.href}><a className="underline underline-offset-4 hover:text-graphite" href={reference.href} rel="noreferrer" target="_blank">{reference.label}</a></li>)}
          </ul>
        </aside> : null}
        <p className="max-w-4xl text-xs leading-6 text-stone-500">Última atualização: 1º de outubro de 2026. Em caso de dúvida, fale com a equipe pelo e-mail contato@atlasmoveis.com.br.</p>
      </div>
    </section>
  );
}
