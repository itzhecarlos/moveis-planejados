import { Headphones, Leaf, ShieldCheck, Truck } from "lucide-react";

const items = [
  {
    icon: Leaf,
    title: "Design autoral",
    description: "Móveis exclusivos com identidade própria."
  },
  {
    icon: ShieldCheck,
    title: "Qualidade premium",
    description: "MDF de alta densidade e ferragens selecionadas."
  },
  {
    icon: Truck,
    title: "Entrega para todo o Brasil",
    description: "Parcerias com transportadoras especializadas em móveis."
  },
  {
    icon: Headphones,
    title: "Atendimento humanizado",
    description: "Suporte próximo antes, durante e após a compra."
  }
];

export function BenefitsGrid() {
  return (
    <section className="border-y border-stone-200 bg-white">
      <div className="container-shell grid gap-6 py-8 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ icon: Icon, title, description }) => (
          <div className="flex gap-4 border-stone-200 xl:border-r xl:pr-6 last:border-r-0" key={title}>
            <Icon className="mt-1 size-6 shrink-0 text-stone-500" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{title}</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
