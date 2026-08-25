"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { Product, PurchaseType } from "@/types";

type ProductCardCartActionsProps = {
  product: Product;
};

const addedLabel: Record<PurchaseType, string> = {
  unit: "Unidade adicionada",
  pair: "Par adicionado"
};

export function ProductCardCartActions({ product }: ProductCardCartActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [lastAdded, setLastAdded] = useState<PurchaseType | null>(null);
  const resetTimer = useRef<number | null>(null);

  const activeVariant = product.variants.find((variant) => variant.active) || product.variants[0];

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  function handleAdd(purchaseType: PurchaseType) {
    addItem({
      productId: product.id,
      variantId: activeVariant?.id,
      colorId: activeVariant?.colorId,
      purchaseType,
      quantity: 1
    });

    setLastAdded(purchaseType);

    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }

    resetTimer.current = window.setTimeout(() => setLastAdded(null), 1400);
  }

  return (
    <div className="mt-auto grid gap-2 pt-4">
      <Button className="w-full" onClick={() => handleAdd("pair")} size="sm" type="button">
        {lastAdded === "pair" ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
        {lastAdded === "pair" ? addedLabel.pair : "Adicionar par"}
      </Button>

      <Button className="w-full" onClick={() => handleAdd("unit")} size="sm" type="button" variant="secondary">
        {lastAdded === "unit" ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
        {lastAdded === "unit" ? addedLabel.unit : "Adicionar unidade"}
      </Button>
    </div>
  );
}
