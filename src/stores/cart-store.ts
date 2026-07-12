"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CartItem, PurchaseType } from "@/types";

type CartStore = {
  items: CartItem[];
  addItem: (payload: CartItem) => void;
  removeItem: (payload: Pick<CartItem, "productId" | "variantId" | "purchaseType">) => void;
  updateQuantity: (payload: Pick<CartItem, "productId" | "variantId" | "purchaseType"> & { quantity: number }) => void;
  clear: () => void;
  count: () => number;
  hasItem: (productId: string, variantId: string | undefined, purchaseType: PurchaseType) => boolean;
};

function isSameItem(a: CartItem, b: Pick<CartItem, "productId" | "variantId" | "purchaseType">) {
  return a.productId === b.productId && a.variantId === b.variantId && a.purchaseType === b.purchaseType;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (payload) =>
        set((state) => {
          const match = state.items.find((item) => isSameItem(item, payload));
          if (match) {
            return {
              items: state.items.map((item) =>
                isSameItem(item, payload) ? { ...item, quantity: item.quantity + payload.quantity } : item
              )
            };
          }
          return { items: [...state.items, payload] };
        }),
      removeItem: (payload) =>
        set((state) => ({ items: state.items.filter((item) => !isSameItem(item, payload)) })),
      updateQuantity: (payload) =>
        set((state) => ({
          items: state.items.map((item) =>
            isSameItem(item, payload) ? { ...item, quantity: Math.max(1, payload.quantity) } : item
          )
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((total, item) => total + item.quantity, 0),
      hasItem: (productId, variantId, purchaseType) =>
        get().items.some((item) => isSameItem(item, { productId, variantId, purchaseType }))
    }),
    {
      name: "atlas-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
