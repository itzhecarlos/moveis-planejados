import { AboutBrand } from "@/components/home/about-brand";
import { BenefitsGrid } from "@/components/home/benefits-grid";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { Hero } from "@/components/home/hero";
import { getProductsByCategory } from "@/lib/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase
        description="Uma coleção inicial com cinco modelos de criados-mudos, cada um com personalidade própria e acabamento pensado para quartos elegantes."
        href="/categoria/criados-mudos"
        products={getProductsByCategory("criados-mudos")}
        title="Criados-mudos"
      />
      <BenefitsGrid />
      <AboutBrand />
    </>
  );
}
