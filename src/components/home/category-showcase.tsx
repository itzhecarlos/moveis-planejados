import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

type CategoryShowcaseProps = {
  title: string;
  description: string;
  href: string;
  products: Product[];
};

export function CategoryShowcase({ title, description, href, products }: CategoryShowcaseProps) {
  return (
    <section className="section-space">
      <div className="container-shell grid gap-10 xl:grid-cols-[260px_1fr] xl:items-start">
        <div className="space-y-6 xl:sticky xl:top-28">
          <SectionHeading description={description} title={title} />
          <Button href={href} variant="secondary">
            Ver todos
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
