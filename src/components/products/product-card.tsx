import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.stockQuantity > 0;
  const unitPrice = product.promotionalPrice || product.unitPrice;
  const pairPrice = product.pairPrice || product.promotionalPrice || product.unitPrice;

  return (
    <Link
      className="group block h-full rounded-[1.45rem] border border-stone-200 bg-white p-3 card-hover sm:rounded-[1.6rem]"
      href={`/produto/${product.slug}`}
    >
      <div className="overflow-hidden rounded-[1.2rem] bg-ivory">
        <Image
          alt={product.images[0]?.alt || product.name}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          height={1100}
          src={product.images[0]?.src || "/images/products/aurora-01/cover.png"}
          width={900}
        />
      </div>

      <div className="flex h-[calc(100%-theme(spacing.0))] flex-col px-1 pb-2 pt-4 sm:px-2">
        <div className="mb-4 flex min-h-[118px] flex-col gap-3 sm:mb-0 sm:min-h-[104px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="min-h-[48px] max-w-[12ch] text-[1.1rem] font-medium leading-[1.1] text-graphite sm:min-h-[60px] sm:text-[1.4rem]">
              {product.name}
            </h3>
            <Badge tone={inStock ? "success" : "warning"}>{inStock ? "Em estoque" : "Sob encomenda"}</Badge>
          </div>
        </div>

        <div className="rounded-[1.1rem] border border-stone-200 bg-gradient-to-br from-stone-50 to-white px-3 py-3 sm:px-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500">Unidade</p>
                <p className="mt-1 break-words text-[1rem] font-semibold leading-none text-graphite sm:text-[1.05rem]">
                  {formatCurrency(unitPrice)}
                </p>
                <p className="mt-2 text-[11px] font-bold text-emerald-700">Desconto de 5% no Pix</p>
              </div>
              <span className="shrink-0 pt-1 text-[10px] uppercase tracking-[0.16em] text-stone-400 sm:tracking-[0.22em]">
                1 peça
              </span>
            </div>

            <div className="border-t border-stone-200 pt-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500">Par</p>
                  <p className="mt-1 break-words text-[1.08rem] font-semibold leading-none text-graphite sm:text-[1.18rem]">
                    {formatCurrency(pairPrice)}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-emerald-700">Desconto de 5% no Pix</p>
                </div>
                <span className="shrink-0 pt-1 text-[10px] uppercase tracking-[0.16em] text-stone-400 sm:tracking-[0.22em]">
                  2 peças
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[44px] pt-4 text-[13px] text-stone-600 sm:min-h-[48px] sm:text-sm">
          <p>{product.dimensions}</p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          {product.colors.map((color) => (
            <span
              aria-label={color.name}
              className="size-4 rounded-full border border-stone-300"
              key={color.id}
              style={{ backgroundColor: color.hexColor }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
