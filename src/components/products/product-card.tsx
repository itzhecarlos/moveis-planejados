import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.stockQuantity > 0;
  const unitPrice = product.promotionalPrice || product.unitPrice;

  return (
    <Link className="group block rounded-[1.6rem] border border-stone-200 bg-white p-3 card-hover" href={`/produto/${product.slug}`}>
      <div className="overflow-hidden rounded-[1.2rem] bg-ivory">
        <Image
          alt={product.images[0]?.alt || product.name}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          height={1100}
          src={product.images[0]?.src || "/images/products/aurora-01/cover.png"}
          width={900}
        />
      </div>
      <div className="space-y-3 px-2 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="max-w-[10ch] text-[1.35rem] font-medium leading-[1.15] text-graphite">{product.name}</h3>
          <Badge tone={inStock ? "success" : "warning"}>{inStock ? "Em estoque" : "Sob encomenda"}</Badge>
        </div>

        <div className="rounded-[1.1rem] border border-stone-200 bg-gradient-to-br from-stone-50 to-white px-4 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500">Valor unitário</p>
              <p className="mt-1 text-[1.55rem] font-semibold leading-none text-graphite">{formatCurrency(unitPrice)}</p>
            </div>
            <span className="pb-1 text-[0.72rem] uppercase tracking-[0.24em] text-stone-500">unid.</span>
          </div>

          {product.pairPrice ? (
            <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Valor do par</p>
              <p className="text-base font-medium text-stone-800">{formatCurrency(product.pairPrice)}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-1 text-sm text-stone-600">
          <p>{product.dimensions}</p>
        </div>

        <div className="flex items-center gap-2 pt-1">
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
