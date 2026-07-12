import { MessageCircle, Phone, Send } from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Contato" }]} />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              description="Nossa equipe atende projetos, dúvidas sobre medidas, prazos, acabamentos e acompanhamento de pedidos."
              eyebrow="Contato"
              title="Fale com a Atlas Móveis"
            />
            <div className="mt-8 space-y-4 text-sm text-stone-600">
              <p className="flex items-center gap-3">
                <MessageCircle className="size-4" /> WhatsApp comercial
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4" /> Atendimento em horário comercial
              </p>
              <p className="flex items-center gap-3">
                <Send className="size-4" /> {siteConfig.email}
              </p>
            </div>
          </div>
          <form className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft">
            <Input placeholder="Nome" />
            <Input placeholder="E-mail" />
            <Input placeholder="Telefone" />
            <Textarea placeholder="Conte um pouco sobre o que você procura" />
            <Button href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank">
              Continuar no WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
