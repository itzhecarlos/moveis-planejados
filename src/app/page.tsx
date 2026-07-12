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
        description="Linhas exclusivas que combinam funcionalidade, beleza e acabamentos de alto padrão para o seu quarto."
        href="/categoria/mesas-de-cabeceira"
        products={getProductsByCategory("mesas-de-cabeceira")}
        title="Mesas de cabeceira"
      />
      <CategoryShowcase
        description="Peças versáteis que complementam diferentes ambientes com praticidade e sofisticação."
        href="/categoria/mesas-laterais"
        products={getProductsByCategory("mesas-laterais")}
        title="Mesas laterais de apoio"
      />
      <BenefitsGrid />
      <AboutBrand />
    </>
  );
}
