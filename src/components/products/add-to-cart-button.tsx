"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { PurchaseType } from "@/types";

type AddToCartButtonProps = {
  productId: string;
  variantId?: string;
  colorId?: string;
  purchaseType: PurchaseType;
  quantity: number;
};

export function AddToCartButton({ productId, variantId, colorId, purchaseType, quantity }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      className="w-full"
      onClick={() => addItem({ productId, variantId, colorId, purchaseType, quantity })}
      type="button"
    >
      <ShoppingBag className="size-4" />
      Adicionar ao carrinho
    </Button>
  );
}
