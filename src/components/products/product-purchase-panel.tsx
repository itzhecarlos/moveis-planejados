"use client";

import { MessageCircle, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatInstallment } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import type { Product, PurchaseType } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState<string | undefined>(product.variants[0]?.id);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("unit");
  const [quantity, setQuantity] = useState(1);

  const activeVariant = product.variants.find((variant) => variant.id === variantId) || product.variants[0];
  const activeColor = product.colors.find((color) => color.id === activeVariant?.colorId) || product.colors[0];

  const basePrice = purchaseType === "pair" && product.pairPrice ? product.pairPrice : product.promotionalPrice || product.unitPrice;
  const total = useMemo(() => basePrice * quantity, [basePrice, quantity]);

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Badge tone={product.stockQuantity > 0 ? "success" : "warning"}>
            {product.stockQuantity > 0 ? "Disponível" : "Sob encomenda"}
          </Badge>
          <span className="text-xs uppercase tracking-[0.24em] text-stone-500">SKU {product.sku}</span>
        </div>
        <div>
          <h1 className="font-serif text-4xl leading-none sm:text-5xl">{product.name}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">{product.shortDescription}</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-medium">{formatCurrency(basePrice)}</p>
          {product.pairPrice ? <p className="text-sm text-stone-500">Par: {formatCurrency(product.pairPrice)}</p> : null}
          <p className="text-sm text-stone-500">{formatInstallment(basePrice)}</p>
        </div>

        <div className="grid gap-5 border-y border-stone-200 py-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Cor</p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => {
                const color = product.colors.find((item) => item.id === variant.colorId);
                return (
                  <button
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                      variant.id === activeVariant?.id ? "border-graphite bg-stone-50" : "border-stone-200"
                    }`}
                    key={variant.id}
                    onClick={() => setVariantId(variant.id)}
                    type="button"
                  >
                    <span className="size-3 rounded-full border border-stone-300" style={{ backgroundColor: color?.hexColor }} />
                    {color?.name || variant.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Tipo de compra</p>
            <div className="flex gap-3">
              <button
                className={`rounded-full border px-4 py-2 text-sm ${purchaseType === "unit" ? "border-graphite bg-stone-50" : "border-stone-200"}`}
                onClick={() => setPurchaseType("unit")}
                type="button"
              >
                Unidade
              </button>
              {product.pairPrice ? (
                <button
                  className={`rounded-full border px-4 py-2 text-sm ${purchaseType === "pair" ? "border-graphite bg-stone-50" : "border-stone-200"}`}
                  onClick={() => setPurchaseType("pair")}
                  type="button"
                >
                  Par
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Quantidade</p>
            <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-1">
              <button className="rounded-full p-2 hover:bg-white" onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">
                <Minus className="size-4" />
              </button>
              <span className="min-w-12 text-center text-sm">{quantity}</span>
              <button className="rounded-full p-2 hover:bg-white" onClick={() => setQuantity((value) => value + 1)} type="button">
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <AddToCartButton
            colorId={activeColor?.id}
            productId={product.id}
            purchaseType={purchaseType}
            quantity={quantity}
            variantId={activeVariant?.id}
          />
          <Button href="/checkout" variant="secondary">
            Comprar agora
          </Button>
          <Button href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" variant="ghost">
            <MessageCircle className="size-4" />
            Atendimento pelo WhatsApp
          </Button>
        </div>

        <dl className="grid gap-4 border-t border-stone-200 pt-6 text-sm text-stone-600 sm:grid-cols-2">
          <div>
            <dt className="uppercase tracking-[0.22em] text-stone-500">Dimensões</dt>
            <dd className="mt-2">{product.dimensions}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.22em] text-stone-500">Materiais</dt>
            <dd className="mt-2">{product.materials}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.22em] text-stone-500">Prazo</dt>
            <dd className="mt-2">{product.productionTime}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.22em] text-stone-500">Garantia</dt>
            <dd className="mt-2">{product.warranty}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="uppercase tracking-[0.22em] text-stone-500">Resumo do pedido</dt>
            <dd className="mt-2 text-lg font-medium text-graphite">{formatCurrency(total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
