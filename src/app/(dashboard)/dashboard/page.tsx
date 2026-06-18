"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Welcome Banner */}
      <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-white/40 bg-white/60 backdrop-blur-xl">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#BF0637]/20 to-purple-500/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 animate-pulse duration-10000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-[#BF0637]/10 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4"></div>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF0637] to-purple-600">{user.fullName?.split(" ")[0] || "User"}</span>!
            </h1>
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-xl">
              Welcome to your R3sults command center. Here's what's happening today.
            </p>
          </div>
          {user.profilePictureUrl && (
            <div className="relative group perspective">
              <div className="absolute inset-0 bg-gradient-to-r from-[#BF0637] to-purple-600 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img 
                src={user.profilePictureUrl} 
                alt="Profile" 
                className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/profile" className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/50 overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-blue-200/50 transition-colors duration-500"></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg mb-4 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              👤
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#BF0637] transition-colors">My Profile</h3>
            <p className="text-sm text-slate-500 leading-snug mb-4 flex-1">Manage your personal information, update your password and view your activity.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-semibold text-slate-700 group-hover:bg-red-50 group-hover:text-[#BF0637] transition-colors self-start">
              Manage <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>

        <div className="group relative bg-white/40 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/30 overflow-hidden flex flex-col cursor-not-allowed">
          <div className="absolute inset-0 bg-slate-50/50 z-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 py-1.5 bg-slate-800/90 backdrop-blur-md text-white text-sm font-semibold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105 whitespace-nowrap">
            Coming Soon
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-xl flex items-center justify-center text-lg mb-4 shadow-inner">
              👨‍👩‍👧‍👦
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Family Finder</h3>
            <p className="text-sm text-slate-500 leading-snug mb-4 flex-1">Connect with your family members and track them during emergencies.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-semibold text-slate-700 self-start">
              Find <span className="text-sm">→</span>
            </div>
          </div>
        </div>

        <Link href="/account/orders" className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/50 overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-orange-200/50 transition-colors duration-500"></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-lg mb-4 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              📦
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#BF0637] transition-colors">My Orders</h3>
            <p className="text-sm text-slate-500 leading-snug mb-4 flex-1">View your recent orders, track shipments, and manage returns.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-semibold text-slate-700 group-hover:bg-red-50 group-hover:text-[#BF0637] transition-colors self-start">
              Orders <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>

        <div className="group relative bg-white/40 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/30 overflow-hidden flex flex-col cursor-not-allowed">
          <div className="absolute inset-0 bg-slate-50/50 z-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 py-1.5 bg-slate-800/90 backdrop-blur-md text-white text-sm font-semibold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105 whitespace-nowrap">
            Coming Soon
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg mb-4 shadow-inner">
              ❓
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Help & Support</h3>
            <p className="text-sm text-slate-500 leading-snug mb-4 flex-1">Get assistance with any issues, view FAQs, and contact support.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-semibold text-slate-700 self-start">
              Help <span className="text-sm">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
