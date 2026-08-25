"use client";

import { useEffect, useRef, useState } from "react";

import { HeroContentPanel } from "@/components/home/hero-content-panel";
import { HeroMediaPanel } from "@/components/home/hero-media-panel";
import type { Product } from "@/types";

type HeroProps = {
  products: Product[];
};

export function Hero({ products }: HeroProps) {
  const [index, setIndex] = useState(0);
  const productTabsRef = useRef<HTMLDivElement>(null);
  const activeProduct = products[index] || products[0];

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % products.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [products.length]);

  useEffect(() => {
    const container = productTabsRef.current;
    const activeTab = container?.querySelector<HTMLButtonElement>(`[data-product-index="${index}"]`);

    if (!container || !activeTab) return;

    const centeredPosition =
      activeTab.offsetLeft - (container.clientWidth - activeTab.offsetWidth) / 2;

    container.scrollTo({
      left: Math.max(0, centeredPosition),
      behavior: "smooth",
    });
  }, [index]);

  function goToSlide(nextIndex: number) {
    const normalized = (nextIndex + products.length) % products.length;
    setIndex(normalized);
  }

  return (
    <section className="border-b border-stone-200 bg-hero-glow">
      <div className="container-shell py-8 sm:py-10 lg:py-16">
        <div className="editorial-grid items-stretch overflow-hidden rounded-[2rem] bg-white lg:h-[760px]">
          <div className="order-2 rounded-b-[2rem] bg-white lg:order-1 lg:h-[760px] lg:rounded-none">
            <HeroContentPanel />
          </div>

          <div className="order-1 overflow-hidden rounded-t-[2rem] lg:order-2 lg:h-[760px] lg:rounded-none">
            {activeProduct ? (
              <HeroMediaPanel
                activeProduct={activeProduct}
                index={index}
                onChange={goToSlide}
                productTabsRef={productTabsRef}
                products={products}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
