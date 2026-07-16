"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const products = getProducts();

  if (!items.length) {
    return <EmptyState description="Adicione peças ao carrinho para iniciar sua seleção." title="Seu carrinho está vazio" />;
  }

  const enriched = items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const price =
      item.purchaseType === "pair" && product?.pairPrice ? product.pairPrice : product?.promotionalPrice || product?.unitPrice || 0;
    return { item, product, price, total: price * item.quantity };
  });

  const subtotal = enriched.reduce((acc, entry) => acc + entry.total, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {enriched.map(({ item, product, price, total }) => (
          <div className="grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-soft sm:grid-cols-[160px_1fr]" key={`${item.productId}-${item.variantId}`}>
            <div className="overflow-hidden rounded-[1.2rem] bg-ivory">
              <Image
                alt={product?.name || "Produto"}
                className="aspect-[4/5] w-full object-cover"
                height={500}
                src={product?.images[0]?.src || "/images/products/aurora-01/cover.png"}
                width={400}
              />
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-medium">{product?.name}</h2>
                    <p className="mt-1 text-sm text-stone-500">{item.purchaseType === "pair" ? "Compra em par" : "Compra unitária"}</p>
                  </div>
                  <button
                    className="text-sm text-stone-500 hover:text-graphite"
                    onClick={() => removeItem({ productId: item.productId, variantId: item.variantId, purchaseType: item.purchaseType })}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
                <p className="mt-4 text-sm text-stone-600">{product?.dimensions}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-1">
                  <button
                    className="rounded-full px-3 py-2"
                    onClick={() =>
                      updateQuantity({
                        productId: item.productId,
                        variantId: item.variantId,
                        purchaseType: item.purchaseType,
                        quantity: item.quantity - 1
                      })
                    }
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-10 text-center text-sm">{item.quantity}</span>
                  <button
                    className="rounded-full px-3 py-2"
                    onClick={() =>
                      updateQuantity({
                        productId: item.productId,
                        variantId: item.variantId,
                        purchaseType: item.purchaseType,
                        quantity: item.quantity + 1
                      })
                    }
                    type="button"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-stone-500">{formatCurrency(price)} cada</p>
                  <p className="text-lg font-medium">{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-3xl">Resumo</h2>
        <div className="mt-6 flex items-center justify-between border-b border-stone-200 pb-4">
          <span className="text-stone-500">Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          O valor final e o estoque serão confirmados novamente no checkout para manter a segurança do pedido.
        </p>
        <div className="mt-6 grid gap-3">
          <Button href="/checkout">Continuar para o checkout</Button>
          <Button href="/produtos" variant="secondary">
            Continuar comprando
          </Button>
        </div>
        <Link className="mt-4 inline-block text-sm text-stone-500 hover:text-graphite" href="/politica-de-entrega">
          Consultar política de entrega
        </Link>
      </aside>
    </div>
  );
}
