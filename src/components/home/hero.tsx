import { HeroContentPanel } from "@/components/home/hero-content-panel";
import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/types";

type HeroProps = { products: Product[] };

export function Hero({ products }: HeroProps) {
  return (
    <section className="border-b border-stone-200 bg-hero-glow">
      <div className="container-shell py-8 sm:py-10 lg:py-16">
        <div className="editorial-grid items-stretch overflow-hidden rounded-[2rem] bg-white lg:h-[760px]">
          <div className="order-2 rounded-b-[2rem] bg-white lg:order-1 lg:h-[760px] lg:rounded-none">
            <HeroContentPanel />
          </div>
          <div className="order-1 overflow-hidden rounded-t-[2rem] lg:order-2 lg:h-[760px] lg:rounded-none">
            <ProductCarousel className="h-full" products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}
