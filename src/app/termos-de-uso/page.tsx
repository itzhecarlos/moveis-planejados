import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";

export default function TermsPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Termos de uso" }]} />
        <SectionHeading
          description="Ao navegar pelo site ou concluir uma compra, você concorda com as regras de uso, proteção de dados, pagamentos e fluxo operacional da Atlas Móveis."
          title="Termos de uso"
        />
      </div>
    </section>
  );
}
