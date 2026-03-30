"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fullNameToFirstLast } from "@/types/user";

function NavbarLogo() {
  return (
    <Image
      src="/Results_logo.png"
      alt="R3sults"
      width={180}
      height={48}
      className="h-10 w-auto max-w-[160px] sm:max-w-[180px] object-contain object-left"
      priority
    />
  );
}

export default function Header() {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, logout, loading: authLoading } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setShowAccountDropdown(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShowShopDropdown(false);
      }
    };
    if (showAccountDropdown || showShopDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountDropdown, showShopDropdown]);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflowX = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflowX = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflowX = "";
    };
  }, [showMobileMenu]);

  return (
    <>
      <header className="w-[90%] ml-[5%] mt-[10px] rounded-md fixed top-0 z-50 bg-white/100 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex pt-0.5 items-center shrink-0">
            <NavbarLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-base font-medium">
            <Link
              className={`transition-colors ${
                pathname === "/"
                  ? "text-[#BF0637]"
                  : "text-black hover:text-[#BF0637]"
              }`}
              href="/"
            >
              Home
            </Link>
            <Link
              className={`transition-colors ${
                pathname === "/about"
                  ? "text-[#BF0637]"
                  : "text-black hover:text-[#BF0637]"
              }`}
              href="/about"
            >
              About
            </Link>
            <Link
              className={`transition-colors ${
                pathname === "/contact"
                  ? "text-[#BF0637]"
                  : "text-black hover:text-[#BF0637]"
              }`}
              href="/contact"
            >
              Contact
            </Link>
            <Link
              className={`transition-colors ${
                pathname === "/news-and-media"
                  ? "text-[#BF0637]"
                  : "text-black hover:text-[#BF0637]"
              }`}
              href="/news-and-media"
            >
              News and Media
            </Link>
            <div
              className="relative"
              ref={shopDropdownRef}
              onMouseEnter={() => setShowShopDropdown(true)}
              onMouseLeave={() => setShowShopDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setShowShopDropdown((v) => !v)}
                className={`transition-colors flex items-center gap-1 ${
                  pathname === "/shop" || pathname === "/merch" || pathname?.startsWith("/merch/")
                    ? "text-[#BF0637]"
                    : "text-black hover:text-[#BF0637]"
                }`}
                aria-expanded={showShopDropdown}
                aria-haspopup="true"
                aria-label="Shop menu"
              >
                Shop
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showShopDropdown && (
                <div className="absolute left-0 top-full mt-1 w-44 py-1 bg-white rounded-lg shadow-xl border border-slate-200/80 z-50">
                  <Link
                    href="/merch"
                    onClick={() => setShowShopDropdown(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname === "/merch" || pathname?.startsWith("/merch/")
                        ? "text-[#BF0637] bg-red-50/50"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#BF0637]"
                    }`}
                  >
                    Merchandise
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setShowShopDropdown(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname === "/shop"
                        ? "text-[#BF0637] bg-red-50/50"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#BF0637]"
                    }`}
                  >
                    Supplies
                  </Link>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={openCart}
              className="relative p-1 text-black hover:text-[#BF0637] transition-colors"
              aria-label={`Cart, ${totalItems} items`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#BF0637] text-white text-xs font-semibold flex items-center justify-center px-1"
                  aria-hidden
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
            <div className="flex items-center gap-4" ref={accountDropdownRef}>
              {!authLoading && (
                user ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowAccountDropdown(true)}
                    onMouseLeave={() => setShowAccountDropdown(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setShowAccountDropdown((v) => !v)}
                      className="flex items-center gap-2 text-black hover:text-[#BF0637] transition-colors"
                      aria-expanded={showAccountDropdown}
                      aria-haspopup="true"
                      aria-label="Account menu"
                    >
                      <span className="font-medium">
                        {user.fullName ? `${fullNameToFirstLast(user.fullName).firstName || user.fullName}'s account` : "Account"}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showAccountDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-white rounded-lg shadow-xl border border-slate-200/80 z-50">
                        <Link
                          href="/profile"
                          onClick={() => setShowAccountDropdown(false)}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                            pathname === "/profile" ? "text-[#BF0637] bg-red-50/50" : "text-slate-700 hover:bg-slate-50 hover:text-[#BF0637]"
                          }`}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setShowAccountDropdown(false)}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                            pathname === "/account/orders" ? "text-[#BF0637] bg-red-50/50" : "text-slate-700 hover:bg-slate-50 hover:text-[#BF0637]"
                          }`}
                        >
                          Orders
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setShowAccountDropdown(false); logout(); }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#BF0637] transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="text-black hover:text-[#BF0637] transition-colors font-medium">
                    Login
                  </Link>
                )
              )}
            </div>
          </nav>
          <button
            ref={menuButtonRef}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-black z-50 relative"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {showMobileMenu ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Backdrop overlay - outside header to avoid padding issues */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Slide-in menu - outside header to avoid padding issues */}
      <div
        ref={menuRef}
        className={`fixed top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-md md:hidden z-50 shadow-2xl transition-all duration-300 ease-in-out ${
          showMobileMenu
            ? "right-0 opacity-100 pointer-events-auto"
            : "-right-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/" onClick={() => setShowMobileMenu(false)} className="shrink-0">
              <NavbarLogo />
            </Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-black hover:opacity-70 transition-opacity p-2"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
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

          {/* Menu Items */}
          <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <Link
                className={`px-4 py-2.5 rounded-lg font-medium text-base ${
                  pathname === "/about" ? "text-[#BF0637] bg-red-50" : "text-black hover:bg-slate-100 hover:text-[#BF0637]"
                }`}
                href="/about"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                className={`px-4 py-2.5 rounded-lg font-medium text-base ${
                  pathname === "/contact" ? "text-[#BF0637] bg-red-50" : "text-black hover:bg-slate-100 hover:text-[#BF0637]"
                }`}
                href="/contact"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
              <Link
                className={`px-4 py-2.5 rounded-lg font-medium text-base ${
                  pathname === "/news-and-media" ? "text-[#BF0637] bg-red-50" : "text-black hover:bg-slate-100 hover:text-[#BF0637]"
                }`}
                href="/news-and-media"
                onClick={() => setShowMobileMenu(false)}
              >
                News and Media
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Shop</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/shop"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold"
                  style={{ backgroundColor: "#BF0637" }}
                >
                  Supplies
                </Link>
                <Link
                  href="/merch"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold border-2 text-[#BF0637] bg-white"
                  style={{ borderColor: "#BF0637" }}
                >
                  Merchandise
                </Link>
                <button
                  type="button"
                  onClick={() => { openCart(); setShowMobileMenu(false); }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold border-2 text-[#BF0637] bg-white"
                  style={{ borderColor: "#BF0637" }}
                >
                  Cart {totalItems > 0 ? `(${totalItems})` : ""}
                </button>
              </div>
            </div>
            {!authLoading && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Account</p>
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        pathname === "/profile" ? "bg-[#BF0637] text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        pathname === "/account/orders" ? "bg-[#BF0637] text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order history
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logout(); setShowMobileMenu(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-[#BF0637] w-full text-left"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold"
                    style={{ backgroundColor: "#BF0637" }}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

    </>
  );
}
