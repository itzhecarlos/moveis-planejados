"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

const benefits = [
  { icon: ShieldCheck, label: "Materiais premium" },
  { icon: Sparkles, label: "Acabamentos impecáveis" },
  { icon: Truck, label: "Frete grátis em PR, SC e RS" },
  { icon: Award, label: "1 ano de garantia" }
];

type HeroProps = {
  products: Product[];
};

export function Hero({ products }: HeroProps) {
  const [index, setIndex] = useState(0);
  const activeProduct = products[index] || products[0];

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % products.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [products.length]);

  function goToSlide(nextIndex: number) {
    const normalized = (nextIndex + products.length) % products.length;
    setIndex(normalized);
  }

  return (
    <section className="border-b border-stone-200 bg-hero-glow">
      <div className="container-shell py-10 sm:py-14 lg:py-16">
        <div className="editorial-grid items-stretch lg:h-[760px]">
          <div className="order-2 flex h-full flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:order-1 lg:px-12">
            <span className="divider-line" />
            <h1 className="max-w-[10ch] font-serif text-[2.3rem] leading-[0.96] tracking-[-0.03em] sm:text-[4.4rem]">
              Design que organiza. Qualidade que permanece.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-stone-700 sm:mt-8 sm:text-base sm:leading-8">
              Criados-mudos em MDF de alta qualidade, com acabamentos impecáveis, desenhados para transformar o
              quarto com calma, organização e elegância.
            </p>
            <div className="mt-8 flex min-h-[72px] flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
              <Button href="/categoria/criados-mudos" size="lg">
                Conheça a coleção
              </Button>
              {activeProduct ? (
                <div className="max-w-full truncate rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-stone-700 sm:max-w-[270px] sm:text-sm">
                  Em destaque: {activeProduct.name}
                </div>
              ) : null}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-stone-200 pt-6 sm:mt-10 sm:grid-cols-4 sm:gap-5 sm:pt-8">
              {benefits.map(({ icon: Icon, label }) => (
                <div className="space-y-3" key={label}>
                  <Icon className="size-6 text-stone-500" />
                  <p className="text-[13px] leading-5 text-stone-700 sm:text-sm sm:leading-6">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 overflow-hidden lg:order-2 lg:h-[760px]">
            {activeProduct ? (
              <div className="relative h-[360px] overflow-hidden rounded-[1.4rem] bg-[#d9c8b9] sm:h-[540px] sm:rounded-none lg:h-full">
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

                  <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-5">
                    {products.map((product, productIndex) => (
                      <button
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] backdrop-blur transition sm:text-xs sm:tracking-[0.22em]",
                          productIndex === index
                            ? "border-white bg-white text-graphite"
                            : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                        )}
                        key={product.id}
                        onClick={() => goToSlide(productIndex)}
                        type="button"
                      >
                        {product.name}
                      </button>
                    ))}
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
