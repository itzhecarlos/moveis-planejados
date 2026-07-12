import { getProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/types";

export function OrderSummary({ items }: { items: CartItem[] }) {
  const products = getProducts();
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
  const shipping = subtotal > 2500 ? 0 : 149;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft">
      <h2 className="font-serif text-3xl">Resumo do pedido</h2>
      <div className="mt-6 space-y-4">
        {enriched.map(({ item, product, total }) => (
          <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4" key={`${item.productId}-${item.variantId}`}>
            <div>
              <p className="font-medium">{product?.name || "Produto"}</p>
              <p className="text-sm text-stone-500">
                {item.purchaseType === "pair" ? "Par" : "Unidade"} · Qtd. {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">{formatCurrency(total)}</p>
          </div>
        ))}
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-500">Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-500">Frete estimado</dt>
          <dd>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-medium">
          <dt>Total</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
