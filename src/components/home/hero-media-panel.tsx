"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RefObject } from "react";

import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

type HeroMediaPanelProps = {
  activeProduct: Product;
  index: number;
  onChange: (nextIndex: number) => void;
  products: Product[];
  productTabsRef: RefObject<HTMLDivElement>;
};

export function HeroMediaPanel({
  activeProduct,
  index,
  onChange,
  products,
  productTabsRef
}: HeroMediaPanelProps) {
  return (
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
              onClick={() => onChange(index - 1)}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Próximo produto"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:size-11"
              onClick={() => onChange(index + 1)}
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
                onClick={() => onChange(productIndex)}
                type="button"
              >
                {product.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
