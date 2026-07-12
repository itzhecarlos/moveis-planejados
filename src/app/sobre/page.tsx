import { AboutBrand } from "@/components/home/about-brand";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";

export default function AboutPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Sobre nós" }]} />
        <SectionHeading
          description="A Atlas Móveis nasceu para traduzir organização, leveza e acabamento premium em peças de uso real. Cada móvel é desenhado com atenção à proporção, à durabilidade e à atmosfera do ambiente."
          eyebrow="Nossa essência"
          title="Uma marca brasileira com olhar editorial para o morar"
        />
      </div>
      <AboutBrand />
    </section>
  );
}
