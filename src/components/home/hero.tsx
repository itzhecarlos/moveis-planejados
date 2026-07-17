"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

const benefits = [
  { icon: ShieldCheck, label: "Materiais premium" },
  { icon: Sparkles, label: "Acabamentos impecáveis" },
  { icon: Truck, label: "Frete grátis no Sul" },
  { icon: Award, label: "1 ano de garantia" }
];

type HeroProps = {
  products: Product[];
};

export function Hero({ products }: HeroProps) {
  const [index, setIndex] = useState(0);
  const activeProduct = products[index] || products[0];
  const productTabsRef = useRef<HTMLDivElement>(null);

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

    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
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
          <div className="order-2 flex min-h-0 flex-col justify-start rounded-b-[2rem] bg-white px-7 py-10 sm:px-8 sm:py-11 lg:order-1 lg:h-[760px] lg:min-h-[760px] lg:max-h-[760px] lg:rounded-none lg:justify-center lg:px-12 lg:py-12 xl:px-14">
            <span className="divider-line" />
            <h1 className="max-w-[8.4ch] pt-3 font-serif text-[2.45rem] leading-[0.94] tracking-[-0.025em] sm:max-w-[8.1ch] sm:pt-2 sm:text-[3.35rem] sm:leading-[0.92] md:max-w-[7.8ch] md:text-[3.9rem] lg:max-w-[7.2ch] lg:pt-0 lg:text-[4.9rem] lg:leading-[0.9] xl:text-[5.3rem]">
              Design que organiza. Qualidade que permanece.
            </h1>
            <p className="mt-7 max-w-[32ch] text-[14px] leading-7 text-stone-700 sm:mt-7 sm:max-w-[36ch] sm:text-[15px] sm:leading-8 lg:mt-9 lg:max-w-[34ch] lg:text-[1rem] lg:leading-8">
              Criados-mudos em MDF de alta qualidade, com acabamentos impecáveis, desenhados para transformar o
              quarto com calma, organização e elegância.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:mt-8 sm:min-h-[72px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:mt-10 lg:min-h-[84px] lg:gap-4">
              <Button className="w-full sm:w-auto" href="/categoria/criados-mudos" size="lg">
                Conheça a coleção
              </Button>
              {activeProduct ? (
                <div className="w-full max-w-full truncate rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[11px] text-stone-700 sm:max-w-[260px] sm:text-xs lg:max-w-[320px] lg:px-5 lg:py-2.5 lg:text-sm">
                  Em destaque: {activeProduct.name}
                </div>
              ) : null}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-stone-200 pt-6 sm:mt-8 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-5 sm:pt-7 lg:mt-10 lg:gap-x-7 lg:gap-y-6 lg:pt-8">
              {benefits.map(({ icon: Icon, label }) => (
                <div className="grid min-h-[72px] content-start gap-2.5 lg:min-h-[88px] lg:gap-3" key={label}>
                  <Icon className="size-4.5 text-stone-500 sm:size-6" />
                  <p className="max-w-[10ch] text-[10px] leading-5 text-stone-700 sm:max-w-none sm:text-[11px] sm:leading-5 lg:max-w-[11ch] lg:text-sm lg:leading-6">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-stone-500 sm:text-[11px] lg:mt-5 lg:text-[0.78rem]">Frete grátis para PR, SC e RS.</p>
          </div>

          <div className="order-1 overflow-hidden rounded-t-[2rem] lg:order-2 lg:h-[760px] lg:rounded-none">
            {activeProduct ? (
              <div className="relative h-[360px] overflow-hidden bg-[#d9c8b9] sm:h-[540px] lg:h-full">
                {products.map((product, productIndex) => (
                  <Image
                    alt={product.images[0]?.alt || product.name}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out motion-reduce:transition-none",
                      productIndex === index ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
                    )}
                    fill
                    key={product.id}
                    priority={productIndex === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    src={product.images[0]?.src || "/images/products/aurora-01/cover.png"}
                  />
                ))}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-h-[118px] text-white sm:min-h-[164px]">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/75">Coleção Atlas</p>
                      <h2 className="mt-2 min-h-[52px] max-w-[12ch] font-serif text-[2rem] leading-[1.02] sm:min-h-[84px] sm:text-4xl">
                        {activeProduct.name}
                      </h2>
                      <p className="mt-2 text-xs text-white/85 sm:text-sm">
                        Unitário: {formatCurrency(activeProduct.promotionalPrice || activeProduct.unitPrice)}
                      </p>
                      <p className="text-xs text-white/85 sm:text-sm">
                        Par: {formatCurrency(activeProduct.pairPrice || activeProduct.unitPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        aria-label="Produto anterior"
                        className="inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:size-11"
                        onClick={() => goToSlide(index - 1)}
                        type="button"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button
                        aria-label="Próximo produto"
                        className="inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:size-11"
                        onClick={() => goToSlide(index + 1)}
                        type="button"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="-mx-1 mt-4 overflow-x-auto px-1 pb-1 pr-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-5 sm:pr-20"
                    ref={productTabsRef}
                  >
                    <div className="flex w-max gap-2">
                      {products.map((product, productIndex) => (
                        <button
                          className={cn(
                            "shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] backdrop-blur transition sm:text-xs sm:tracking-[0.22em]",
                            productIndex === index
                              ? "border-white bg-white text-graphite"
                              : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                          )}
                          data-product-index={productIndex}
                          key={product.id}
                          onClick={() => goToSlide(productIndex)}
                          type="button"
                        >
                          {product.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {products.map((product, productIndex) => (
                      <Link
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          productIndex === index ? "w-10 bg-white" : "w-4 bg-white/45 hover:bg-white/70"
                        )}
                        href={`/produto/${product.slug}`}
                        key={product.id}
                      >
                        <span className="sr-only">{product.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
