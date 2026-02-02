"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/types/product";

export type CartItemOptions = { size?: string; color?: string };

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

export function getCartLineKey(item: CartItem): string {
  return `${item.product.id}|${item.selectedSize ?? ""}|${item.selectedColor ?? ""}`;
}

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, options?: CartItemOptions) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CART_STORAGE_KEY = "r3sults_shop_cart";

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated) saveToStorage(items);
  }, [items, hasHydrated]);

  const addItem = useCallback(
    (product: Product, quantity = 1, options?: CartItemOptions) => {
      const size = options?.size;
      const color = options?.color;
      setItems((prev) => {
        const key = `${product.id}|${size ?? ""}|${color ?? ""}`;
        const i = prev.findIndex(
          (x) => getCartLineKey(x) === key
        );
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], quantity: next[i].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            product,
            quantity,
            selectedSize: size,
            selectedColor: color,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((x) => getCartLineKey(x) !== lineKey));
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((x) => getCartLineKey(x) !== lineKey));
      return;
    }
    setItems((prev) =>
      prev.map((x) =>
        getCartLineKey(x) === lineKey ? { ...x, quantity } : x
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((o) => !o), []);

  const value: CartContextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
