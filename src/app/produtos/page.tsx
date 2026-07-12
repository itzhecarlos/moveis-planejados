import { ProductGrid } from "@/components/products/product-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProducts } from "@/lib/catalog";

export default function ProductsPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <Breadcrumb items={[{ href: "/", label: "Início" }, { label: "Produtos" }]} />
        <SectionHeading
          description="Explore toda a coleção Atlas Móveis em uma seleção editorial, com peças para quarto, sala e apoio."
          eyebrow="Catálogo"
          title="Todos os produtos"
        />
        <ProductGrid products={getProducts()} />
      </div>
    </section>
  );
}
