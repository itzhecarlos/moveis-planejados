import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ShippingPolicyPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Política de entrega" }]} />
        <SectionHeading
          description="Os prazos variam conforme produto, região e agenda de produção. Antes do envio, a Atlas Móveis confirma a liberação do pedido e o melhor parceiro logístico."
          title="Política de entrega"
        />
      </div>
    </section>
  );
}
