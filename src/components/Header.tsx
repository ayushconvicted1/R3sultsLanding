"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoSvg from "./images/Logo";

export default function Header() {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    // Close tooltip when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        loginButtonRef.current &&
        !loginButtonRef.current.contains(event.target as Node) &&
        showLoginTooltip
      ) {
        setShowLoginTooltip(false);
      }
    };

    if (showLoginTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setShowLoginTooltip(false);
      }, 3000);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [showLoginTooltip]);

  return (
    <>
      <header className="w-[90%] ml-[5%] mt-[10px] rounded-md fixed top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex pt-0.5 items-center">
            <LogoSvg height={30} width={100} color="#000" />
          </div>
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
            <div className="relative">
              <button
                ref={loginButtonRef}
                onClick={() => setShowLoginTooltip(!showLoginTooltip)}
                className="text-black hover:text-[#BF0637] transition-colors relative"
              >
                Login
              </button>
              {showLoginTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/95 backdrop-blur-md rounded-md px-4 py-2.5 shadow-xl border border-gray-200/50 min-w-[140px] relative">
                    <p className="text-[#BF0637] font-semibold text-sm text-center whitespace-nowrap">
                      Coming Soon
                    </p>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 border-l border-t border-gray-200/50 rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
            {/* Notification Icon */}
            <div className="absolute right-[-40px] cursor-pointer">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 bg-[#BF0637] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
                1
              </span>
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
            <LogoSvg height={30} width={100} color="#000" />
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
          <nav className="flex flex-col flex-1 p-6 gap-2">
            <Link
              className={`px-4 py-3 rounded-md transition-colors font-medium text-base ${
                pathname === "/about"
                  ? "text-[#BF0637] bg-gray-100"
                  : "text-black hover:bg-gray-100 hover:text-[#BF0637]"
              }`}
              href="/about"
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </Link>
            <Link
              className={`px-4 py-3 rounded-md transition-colors font-medium text-base ${
                pathname === "/contact"
                  ? "text-[#BF0637] bg-gray-100"
                  : "text-black hover:bg-gray-100 hover:text-[#BF0637]"
              }`}
              href="/contact"
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </Link>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowLoginTooltip(true);
                  setShowMobileMenu(false);
                }}
                className="w-full text-white px-5 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#BF0637" }}
              >
                Login
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Login Tooltip for Mobile */}
      {showLoginTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm md:hidden">
          <div
            className="bg-white/95 backdrop-blur-md rounded-lg px-6 py-4 shadow-lg border border-white/20 mx-4"
            onClick={() => setShowLoginTooltip(false)}
          >
            <p className="text-[#BF0637] font-medium text-base text-center">
              Coming Soon
            </p>
          </div>
        </div>
      )}
    </>
  );
}
