"use client";
import { useState, useEffect, useRef } from "react";
import LogoSvg from "./images/Logo";

export default function Header() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    setShowContactForm(false);
    setFormData({ email: "", password: "" });
  };

  return (
    <>
      <header className="w-[90%] ml-[5%] mt-[10px] rounded-md fixed top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <LogoSvg height={30} width={100} color="#000" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-black">
            <a
              className="hover:opacity-70 transition-opacity"
              href="#home"
              style={{ color: "inherit" }}
            >
              Home
            </a>
            <a
              className="hover:opacity-70 transition-opacity"
              href="#team"
              style={{ color: "inherit" }}
            >
              Team
            </a>
            <a
              className="hover:opacity-70 transition-opacity"
              href="#about"
              style={{ color: "inherit" }}
            >
              About
            </a>
            <a
              className="hover:opacity-70 transition-opacity"
              href="#contact"
              style={{ color: "inherit" }}
            >
              Contact
            </a>
            <button
              onClick={() => setShowContactForm(true)}
              className="text-white px-5 py-2 rounded-md text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#BF0637" }}
            >
              Join Us
            </button>
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
            <a
              className="text-black hover:bg-gray-100 px-4 py-3 rounded-md transition-colors font-medium"
              href="#home"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </a>
            <a
              className="text-black hover:bg-gray-100 px-4 py-3 rounded-md transition-colors font-medium"
              href="#team"
              onClick={() => setShowMobileMenu(false)}
            >
              Team
            </a>
            <a
              className="text-black hover:bg-gray-100 px-4 py-3 rounded-md transition-colors font-medium"
              href="#about"
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </a>
            <a
              className="text-black hover:bg-gray-100 px-4 py-3 rounded-md transition-colors font-medium"
              href="#contact"
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </a>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowContactForm(true);
                  setShowMobileMenu(false);
                }}
                className="w-full text-white px-5 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#BF0637" }}
              >
                Join Us
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Contact Form Overlay */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
          <div className="contact-form-overlay bg-white/90 backdrop-blur-md p-8 w-full max-w-md h-full flex flex-col justify-center shadow-2xl">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-black hover:opacity-70 text-2xl transition-opacity"
            >
              ×
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-black placeholder:text-slate-500 focus:outline-none"
                onFocus={(e) => (e.target.style.borderColor = "#BF0637")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-black placeholder:text-slate-500 focus:outline-none"
                onFocus={(e) => (e.target.style.borderColor = "#BF0637")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                required
              />
              <button
                type="submit"
                className="w-full text-white px-5 py-3 rounded-md font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#BF0637" }}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
