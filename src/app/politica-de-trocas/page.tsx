import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ExchangePolicyPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Política de trocas" }]} />
        <SectionHeading
          description="Nossa política segue o Código de Defesa do Consumidor e as particularidades de produção sob encomenda. Itens personalizados devem ser analisados caso a caso."
          title="Política de trocas"
        />
      </div>
    </section>
  );
}
