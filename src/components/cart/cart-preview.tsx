"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getProducts } from "@/lib/catalog";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function CartPreview() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((state) => state.items);
  const count = useCartStore((state) => state.count());
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const products = useMemo(() => getProducts(), []);

  const enriched = items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const price =
      item.purchaseType === "pair" && product?.pairPrice ? product.pairPrice : product?.promotionalPrice || product?.unitPrice || 0;

    return {
      item,
      product,
      price,
      total: price * item.quantity
    };
  });

  const subtotal = enriched.reduce((acc, entry) => acc + entry.total, 0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Abrir prévia do carrinho"
        className="relative rounded-full border border-stone-200 p-3 hover:border-stone-300"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <ShoppingBag className="size-5" />
        <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-graphite text-[10px] text-white">
          {hydrated ? count : 0}
        </span>
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-4 w-[380px] rounded-[1.6rem] border border-stone-200 bg-white p-4 shadow-soft transition duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Seu carrinho</p>
            <h2 className="mt-1 font-serif text-3xl">Prévia da compra</h2>
          </div>
          <button
            aria-label="Fechar prévia do carrinho"
            className="rounded-full border border-stone-200 p-2 text-stone-500 hover:text-graphite"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        {enriched.length ? (
          <>
            <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {enriched.map(({ item, product, price, total }) => (
                <div className="grid grid-cols-[72px_1fr_auto] gap-3 rounded-[1.2rem] border border-stone-100 p-2" key={`${item.productId}-${item.variantId}`}>
                  <div className="overflow-hidden rounded-[0.9rem] bg-ivory">
                    <Image
                      alt={product?.name || "Produto"}
                      className="aspect-square w-full object-cover"
                      height={200}
                      src={product?.images[0]?.src || "/images/products/aurora-01/cover.png"}
                      width={200}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-graphite">{product?.name || "Produto"}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {item.purchaseType === "pair" ? "Par" : "Unidade"} · Qtd. {item.quantity}
                    </p>
                    <p className="mt-2 text-xs text-stone-500">{formatCurrency(price)} cada</p>
                    <p className="mt-1 text-sm font-semibold text-graphite">{formatCurrency(total)}</p>
                  </div>
                  <button
                    aria-label={`Remover ${product?.name || "produto"} do carrinho`}
                    className="self-start rounded-full border border-stone-200 p-2 text-stone-500 hover:border-stone-300 hover:text-graphite"
                    onClick={() =>
                      removeItem({
                        productId: item.productId,
                        variantId: item.variantId,
                        purchaseType: item.purchaseType
                      })
                    }
                    type="button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4 border-t border-stone-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <strong className="text-graphite">{formatCurrency(subtotal)}</strong>
              </div>
              <p className="text-xs leading-6 text-stone-500">O valor final pode receber 5% de desconto adicional em pagamentos via Pix no checkout.</p>
              <div className="grid gap-3">
                <Button href="/checkout" onClick={() => setOpen(false)}>
                  Concluir compra
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button href="/carrinho" onClick={() => setOpen(false)} variant="secondary">
                    Ver carrinho
                  </Button>
                  <button
                    className="rounded-full border border-stone-200 px-4 py-3 text-sm text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                    onClick={() => clear()}
                    type="button"
                  >
                    Esvaziar
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6">
            <EmptyState
              description="Adicione itens para ver uma prévia rápida da sua compra por aqui."
              title="Carrinho vazio"
            />
          </div>
        )}
      </div>
    </div>
  );
}
