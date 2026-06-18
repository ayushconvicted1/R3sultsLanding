"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#BF0637]"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Profile", href: "/profile", icon: "👤" },
    { name: "Family Finder", href: "/dashboard/family-finder", icon: "👨‍👩‍👧‍👦" },
    { name: "Orders", href: "/account/orders", icon: "📦" },
    { name: "Help", href: "/contact", icon: "❓" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-[80px]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 z-10 hidden md:flex md:flex-col sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-6 flex-1 flex flex-col">
          {user && (
            <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 shadow-sm">
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-xl shadow-inner">👤</div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user.fullName?.split(" ")[0] || "User"}</p>
                <p className="text-xs text-slate-500 truncate">Online</p>
              </div>
            </div>
          )}
          
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isComingSoon = item.name === "Family Finder" || item.name === "Help";
              
              if (isComingSoon) {
                return (
                  <div key={item.name} className="relative group">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 cursor-not-allowed bg-slate-50/50">
                      <span className="text-xl opacity-40 grayscale">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                      Coming Soon
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-800"></div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-red-50 to-transparent text-[#BF0637] shadow-[inset_3px_0_0_#BF0637]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[inset_3px_0_0_#e2e8f0]"
                  }`}
                >
                  <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-slate-100 mb-4">
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-slate-600 font-medium hover:bg-red-50 hover:text-[#BF0637] transition-all duration-200 border border-transparent hover:border-red-100 group"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 overflow-x-auto whitespace-nowrap scrollbar-hide flex-shrink-0 z-10 sticky top-[80px]">
        <nav className="flex space-x-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isComingSoon = item.name === "Family Finder" || item.name === "Help";
            
            if (isComingSoon) {
              return (
                <div key={item.name} className="relative group">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-slate-50 text-slate-400 cursor-not-allowed">
                    <span className="opacity-50">{item.icon}</span>
                    {item.name}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    Coming Soon
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  isActive
                    ? "bg-red-50 text-[#BF0637] font-semibold"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
          
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-[#BF0637] transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
