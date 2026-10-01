"use client";

import { useEffect, useRef, useState } from "react";

import { HeroMediaPanel } from "@/components/home/hero-media-panel";
import type { Product } from "@/types";

export function ProductCarousel({ products, className, mediaClassName }: { products: Product[]; className?: string; mediaClassName?: string }) {
  const [index, setIndex] = useState(0);
  const productTabsRef = useRef<HTMLDivElement>(null);
  const activeProduct = products[index] || products[0];

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % products.length), 4500);
    return () => window.clearInterval(interval);
  }, [products.length]);

  useEffect(() => {
    const container = productTabsRef.current;
    const activeTab = container?.querySelector<HTMLButtonElement>(`[data-product-index="${index}"]`);
    if (!container || !activeTab) return;
    const centeredPosition = activeTab.offsetLeft - (container.clientWidth - activeTab.offsetWidth) / 2;
    container.scrollTo({ left: Math.max(0, centeredPosition), behavior: "smooth" });
  }, [index]);

  function goToSlide(nextIndex: number) {
    setIndex((nextIndex + products.length) % products.length);
  }

  if (!activeProduct) return null;

  return <div className={className}><HeroMediaPanel activeProduct={activeProduct} index={index} mediaClassName={mediaClassName} onChange={goToSlide} productTabsRef={productTabsRef} products={products} /></div>;
}
