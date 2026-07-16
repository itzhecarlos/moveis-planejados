import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug, product.categorySlug);

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/produtos", label: "Produtos" },
            { href: `/categoria/${product.categorySlug}`, label: product.categorySlug.replace(/-/g, " ") },
            { label: product.name }
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <ProductGallery images={product.images} />
          <ProductPurchasePanel product={product} />
        </div>

        <div className="grid gap-6 rounded-[2rem] border border-stone-200 bg-white p-8 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl">Descrição</h2>
            <p className="mt-4 text-sm leading-8 text-stone-600">{product.description}</p>
          </div>
          <div className="grid gap-4 text-sm text-stone-600">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Peso</p>
              <p className="mt-2">{product.weight} kg</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Entrega</p>
              <p className="mt-2">Atendimento consultivo para todo o Brasil, com frete grátis em toda a Região Sul: PR, SC e RS.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Garantia</p>
              <p className="mt-2">{product.warranty}</p>
            </div>
          </div>
        </div>

        {related.length ? (
          <div className="space-y-8">
            <SectionHeading
              description="Peças com a mesma linguagem estética para complementar o ambiente."
              eyebrow="Relacionados"
              title="Você também pode gostar"
            />
            <ProductGrid products={related} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
