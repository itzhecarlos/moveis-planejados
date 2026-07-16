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
  { icon: Truck, label: "Entrega para todo o Brasil" },
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
      <div className="container-shell editorial-grid items-stretch py-10 sm:py-14 lg:py-16">
        <div className="order-2 flex flex-col justify-center bg-white px-6 py-8 sm:px-10 lg:order-1 lg:px-12">
          <span className="divider-line" />
          <h1 className="max-w-[10ch] font-serif text-[3rem] leading-[0.92] tracking-[-0.03em] sm:text-[4.4rem]">
            Design que organiza. Qualidade que permanece.
          </h1>
          <p className="mt-8 max-w-md text-base leading-8 text-stone-700">
            Criados-mudos em MDF de alta qualidade, com acabamentos impecáveis, desenhados para transformar o quarto com calma, organização e elegância.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/categoria/criados-mudos" size="lg">
              Conheça a coleção
            </Button>
            {activeProduct ? (
              <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-700">
                Em destaque: {activeProduct.name}
              </div>
            ) : null}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 border-t border-stone-200 pt-8 sm:grid-cols-4">
            {benefits.map(({ icon: Icon, label }) => (
              <div className="space-y-3" key={label}>
                <Icon className="size-6 text-stone-500" />
                <p className="text-sm leading-6 text-stone-700">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 overflow-hidden lg:order-2">
          {activeProduct ? (
            <div className="relative h-full min-h-[380px] overflow-hidden bg-[#d9c8b9]">
              <Image
                alt={activeProduct.images[0]?.alt || activeProduct.name}
                className="h-full w-full object-cover"
                height={activeProduct.images[0]?.height || 1254}
                src={activeProduct.images[0]?.src || "/images/products/aurora-01/cover.png"}
                width={activeProduct.images[0]?.width || 1254}
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/75">Coleção Atlas</p>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{activeProduct.name}</h2>
                    <p className="mt-2 text-sm text-white/85">Unitário: {formatCurrency(activeProduct.promotionalPrice || activeProduct.unitPrice)}</p>
                    <p className="text-sm text-white/85">Par: {formatCurrency(activeProduct.pairPrice || activeProduct.unitPrice)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Produto anterior"
                      className="inline-flex size-11 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                      onClick={() => goToSlide(index - 1)}
                      type="button"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      aria-label="Próximo produto"
                      className="inline-flex size-11 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                      onClick={() => goToSlide(index + 1)}
                      type="button"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {products.map((product, productIndex) => (
                    <button
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] backdrop-blur transition",
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
    </section>
  );
}
