"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PrintifyLineItem } from "@/types/printify";

const STORAGE_KEY = "r3sults_merch_cart";

type MerchCartContextValue = {
  items: PrintifyLineItem[];
  addItem: (item: PrintifyLineItem) => void;
  removeItem: (productId: string, variantId: number) => void;
  updateQuantity: (productId: string, variantId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const MerchCartContext = createContext<MerchCartContextValue | null>(null);

function loadCart(): PrintifyLineItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PrintifyLineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: PrintifyLineItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function lineKey(productId: string, variantId: number) {
  return `${productId}:${variantId}`;
}

export function MerchCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PrintifyLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((item: PrintifyLineItem) => {
    setItems((prev) => {
      const key = lineKey(item.product_id, item.variant_id);
      const idx = prev.findIndex(
        (i) => lineKey(i.product_id, i.variant_id) === key
      );
      const qty = Math.max(1, Math.min(99, item.quantity || 1));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: number) => {
    setItems((prev) =>
      prev.filter(
        (i) => lineKey(i.product_id, i.variant_id) !== lineKey(productId, variantId)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: number, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, variantId);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          lineKey(i.product_id, i.variant_id) === lineKey(productId, variantId)
            ? { ...i, quantity: Math.min(99, quantity) }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems]
  );

  return (
    <MerchCartContext.Provider value={value}>{children}</MerchCartContext.Provider>
  );
}

export function useMerchCart() {
  const ctx = useContext(MerchCartContext);
  if (!ctx) throw new Error("useMerchCart must be used within MerchCartProvider");
  return ctx;
}
