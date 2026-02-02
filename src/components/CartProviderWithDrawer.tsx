"use client";

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function CartProviderWithDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
