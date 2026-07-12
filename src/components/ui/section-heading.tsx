type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span className={align === "center" ? "divider-line mx-auto" : "divider-line"} />
      {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p> : null}
      <h2 className="font-serif text-4xl leading-none text-graphite sm:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">{description}</p> : null}
    </div>
  );
}
