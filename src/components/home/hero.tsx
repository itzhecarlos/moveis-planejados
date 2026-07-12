import Image from "next/image";
import { ShieldCheck, Sparkles, Truck, Award } from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  { icon: ShieldCheck, label: "Materiais premium" },
  { icon: Sparkles, label: "Acabamentos impecáveis" },
  { icon: Truck, label: "Entrega para todo o Brasil" },
  { icon: Award, label: "1 ano de garantia" }
];

export function Hero() {
  return (
    <section className="border-b border-stone-200 bg-hero-glow">
      <div className="container-shell editorial-grid items-stretch py-10 sm:py-14 lg:py-16">
        <div className="order-2 flex flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:order-1 lg:px-12">
          <span className="divider-line" />
          <h1 className="max-w-[10ch] font-serif text-[3rem] leading-[0.92] tracking-[-0.03em] sm:text-[4.4rem]">
            Design que organiza. Qualidade que permanece.
          </h1>
          <p className="mt-8 max-w-md text-base leading-8 text-stone-700">
            Móveis em MDF de alta qualidade, com acabamentos impecáveis, criados para transformar sua casa em um lugar único.
          </p>
          <div className="mt-10">
            <Button href="/produtos" size="lg">
              Conheça a coleção
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 border-t border-stone-200 pt-8 sm:grid-cols-4">
            {benefits.map(({ icon: Icon, label }) => (
              <div className="space-y-3" key={label}>
                <Icon className="size-6 text-stone-500" />
                <p className="text-sm leading-6 text-stone-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 overflow-hidden lg:order-2">
          <Image
            alt="Ambiente sofisticado com mesa de cabeceira Atlas Móveis"
            className="h-full min-h-[380px] w-full object-cover"
            height={1200}
            src="/images/hero/hero-bedroom.svg"
            width={1400}
          />
        </div>
      </div>
    </section>
  );
}
