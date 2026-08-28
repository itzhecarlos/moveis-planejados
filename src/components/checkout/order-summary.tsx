"use client";

import { useEffect, useState } from "react";

import { PIX_DISCOUNT_RATE, normalizeBrazilState } from "@/lib/checkout/pricing";
import { getProducts } from "@/lib/catalog";
import { FALLBACK_CARRIER_DELIVERY_DAYS, PRODUCTION_TIME_DAYS, type ShippingQuote } from "@/lib/shipping/types";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, PaymentMethod } from "@/types";

type OrderSummaryProps = {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  shippingPostalCode: string;
  shippingState: string;
  onShippingServiceChange: (serviceId: number | null) => void;
};

export function OrderSummary({
  items,
  paymentMethod,
  shippingPostalCode,
  shippingState,
  onShippingServiceChange
}: OrderSummaryProps) {
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [isQuoting, setIsQuoting] = useState(false);
  const products = getProducts();
  const enriched = items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const price =
      item.purchaseType === "pair" && product?.pairPrice
        ? product.pairPrice
        : product?.promotionalPrice || product?.unitPrice || 0;

    return {
      item,
      product,
      price,
      total: price * item.quantity
    };
  });

  const subtotal = enriched.reduce((acc, entry) => acc + entry.total, 0);
  const pixDiscount = paymentMethod === "pix" ? subtotal * PIX_DISCOUNT_RATE : 0;
  const normalizedState = normalizeBrazilState(shippingState);
  const postalCodeDigits = shippingPostalCode.replace(/\D/g, "");
  const qualifiesForRegionalFreeShipping = quote?.freeShipping === true;
  const shipping = quote?.chargedAmount ?? 0;
  const total = subtotal - pixDiscount + shipping;

  useEffect(() => {
    if (postalCodeDigits.length !== 8 || normalizedState.length !== 2 || items.length === 0) {
      setQuote(null);
      onShippingServiceChange(null);
      setQuoteError("");
      setIsQuoting(false);
      return;
    }

    const controller = new AbortController();
    setQuote(null);
    setQuoteError("");
    setIsQuoting(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            postalCode: postalCodeDigits,
            state: normalizedState
          }),
          signal: controller.signal
        });
        const data = (await response.json()) as ShippingQuote & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível calcular o frete.");
        }

        setQuote(data);
        onShippingServiceChange(data.serviceId);
      } catch (error) {
        if (controller.signal.aborted) return;
        setQuote(null);
        onShippingServiceChange(null);
        setQuoteError(error instanceof Error ? error.message : "Não foi possível calcular o frete.");
      } finally {
        if (!controller.signal.aborted) {
          setIsQuoting(false);
        }
      }
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [items, normalizedState, onShippingServiceChange, postalCodeDigits]);

  return (
    <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft">
      <h2 className="font-serif text-3xl">Resumo do pedido</h2>
      <div className="mt-6 space-y-4">
        {enriched.map(({ item, product, total: itemTotal }) => (
          <div
            className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4"
            key={`${item.productId}-${item.variantId}-${item.purchaseType}`}
          >
            <div>
              <p className="font-medium">{product?.name || "Produto"}</p>
              <p className="text-sm text-stone-500">
                {item.purchaseType === "pair" ? "Par" : "Unidade"} · Qtd. {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">{formatCurrency(itemTotal)}</p>
          </div>
        ))}
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-500">Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>

        {paymentMethod === "pix" ? (
          <div className="flex justify-between font-semibold text-emerald-700">
            <dt>Desconto Pix 5%</dt>
            <dd>-{formatCurrency(pixDiscount)}</dd>
          </div>
        ) : null}

        {quote?.options.length ? (
          <div className="space-y-2 border-y border-stone-100 py-3">
            <p className="text-stone-500">
              {quote.freeShipping ? "Escolha entre as melhores opções de custo-benefício" : "Escolha a modalidade de entrega"}
            </p>
            {quote.freeShipping ? <p className="text-xs text-stone-500">Exibimos até 3 opções considerando o custo real e o prazo da transportadora.</p> : null}
            {quote.options.map((option) => (
              <button
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${option.serviceId === quote.serviceId ? "border-graphite bg-stone-50" : "border-stone-200 hover:border-stone-400"}`}
                key={option.serviceId}
                onClick={() => {
                  setQuote((current) => current ? { ...current, serviceId: option.serviceId, quotedAmount: option.quotedAmount, chargedAmount: option.chargedAmount, freeShipping: option.freeShipping, deliveryDays: option.deliveryDays, productionDays: option.productionDays, totalDeliveryDays: option.totalDeliveryDays, serviceName: option.serviceName, carrierName: option.carrierName } : current);
                  onShippingServiceChange(option.serviceId);
                }}
                type="button"
              >
                <span><strong className="block font-medium text-graphite">{option.carrierName} · {option.serviceName}</strong><span className="text-xs text-stone-500">Prazo total estimado: {option.totalDeliveryDays} dias</span></span>
                {option.freeShipping ? (
                  <span className="text-right"><span className="block text-xs text-stone-400 line-through">{formatCurrency(option.quotedAmount)}</span><strong className="text-emerald-700">Grátis</strong></span>
                ) : <strong>{formatCurrency(option.chargedAmount)}</strong>}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <dt className="text-stone-500">Frete estimado</dt>
          <dd className="text-right">
            {qualifiesForRegionalFreeShipping ? (
              <span className="inline-flex items-center gap-2">
                <span className="text-stone-400 line-through">{formatCurrency(quote.quotedAmount)}</span>
                <span className="font-semibold text-emerald-700">Grátis</span>
              </span>
            ) : isQuoting ? (
              <span className="text-stone-500">Calculando...</span>
            ) : quote ? (
              formatCurrency(shipping)
            ) : (
              <span className="text-stone-500">A calcular</span>
            )}
          </dd>
        </div>

        {postalCodeDigits.length !== 8 ? (
          <p className="text-xs text-stone-500">
            Informe o CEP e a UF para consultar o frete em tempo real. PR, SC e RS têm frete grátis.
          </p>
        ) : null}

        {quote ? (
          <p className="text-xs text-stone-500">
            Prazo total estimado de {quote.totalDeliveryDays} dias: {quote.productionDays} dias corridos de produção + {quote.deliveryDays} dias úteis de transporte por {quote.carrierName} · {quote.serviceName}.
          </p>
        ) : (
          <p className="text-xs text-stone-500">
            O prazo será calculado somando {PRODUCTION_TIME_DAYS} dias corridos de produção ao prazo da transportadora. Se ela não informar um prazo, usamos {FALLBACK_CARRIER_DELIVERY_DAYS} dias como estimativa de transporte.
          </p>
        )}

        {qualifiesForRegionalFreeShipping ? (
          <p className="text-xs font-semibold text-emerald-700">Frete grátis aplicado para PR, SC e RS.</p>
        ) : null}

        {quoteError ? <p className="text-xs font-medium text-red-600">{quoteError}</p> : null}

        <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-medium">
          <dt>Total</dt>
          <dd>{quote ? formatCurrency(total) : "A calcular"}</dd>
        </div>
      </dl>
    </aside>
  );
}
