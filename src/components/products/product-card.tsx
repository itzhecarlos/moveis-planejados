import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.stockQuantity > 0;

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
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <Badge tone={inStock ? "success" : "warning"}>{inStock ? "Em estoque" : "Sob encomenda"}</Badge>
        </div>
        <div className="space-y-1 text-sm text-stone-700">
          <p>{formatCurrency(product.promotionalPrice || product.unitPrice)} (unid.)</p>
          {product.pairPrice ? <p>{formatCurrency(product.pairPrice)} (par)</p> : null}
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
