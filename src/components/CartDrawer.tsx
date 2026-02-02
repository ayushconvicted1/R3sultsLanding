"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, getCartLineKey } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    closeCart,
    totalItems,
  } = useCart();

  const subtotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Cart ({totalItems})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const key = getCartLineKey(item);
                return (
                  <li
                    key={key}
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized={item.product.image.startsWith("http")}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[#BF0637] font-semibold mt-0.5">
                        ${item.product.price.toFixed(2)}
                      </p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-slate-500 mt-1">
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                          {item.selectedSize && item.selectedColor && " · "}
                          {item.selectedColor && (
                            <span>Color: {item.selectedColor}</span>
                          )}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(key, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded border border-gray-300 text-sm hover:bg-gray-50"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(key, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded border border-gray-300 text-sm hover:bg-gray-50"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="text-slate-400 hover:text-red-600 text-sm ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-slate-700">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Clear cart
            </button>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 text-center"
              style={{ backgroundColor: "#BF0637" }}
            >
              Proceed to checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
