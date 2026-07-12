import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";

export default function PrivacyPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Política de privacidade" }]} />
        <SectionHeading
          description="Coletamos apenas os dados necessários para atendimento, processamento do pedido, emissão de comunicações transacionais e melhoria da experiência no site."
          title="Política de privacidade"
        />
      </div>
    </section>
  );
}
