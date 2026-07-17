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
    title: "Frete grátis no Sul",
    description: "Entregamos em todo o PR, SC e RS com frete grátis na região."
  },
  {
    icon: Headphones,
    title: "Atendimento humanizado",
    description: "Suporte próximo antes, durante e após a compra."
  }
];

export function BenefitsGrid() {
  return (
    <section className="bg-transparent">
      <div className="container-shell grid gap-6 rounded-[2rem] border border-stone-200 bg-white px-6 py-8 md:grid-cols-2 lg:px-8 xl:grid-cols-4">
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
