import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/site";

export function AboutBrand() {
  return (
    <section className="section-space">
      <div className="container-shell grid gap-10 rounded-[2rem] bg-white px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[2rem]">
          <Image
            alt="Ambiente decorado com móvel Atlas"
            className="h-full w-full object-cover"
            height={1200}
            src="/images/institutional/about-room.svg"
            width={1400}
          />
        </div>
        <div className="flex flex-col justify-center rounded-[1.75rem] bg-stone-50/70 p-6 sm:p-8">
          <SectionHeading
            description="Cada peça é desenhada para entregar uso real, presença discreta e acabamento duradouro. Trabalhamos com uma leitura estética limpa, materiais selecionados e atenção aos detalhes que fazem a casa respirar melhor."
            eyebrow="Sobre a marca"
            title="Móveis criados para valorizar os detalhes da sua casa."
          />
          <div className="mt-8">
            <Button href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank">
              Falar com a Atlas no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
