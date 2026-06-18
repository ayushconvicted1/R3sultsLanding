"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  if (user) return null;

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-6 text-center">
          <p className="text-slate-600 mb-4">Redirecting to login…</p>
          <p className="text-sm text-slate-500 mb-4">
            New user? Just log in with your phone — we&apos;ll create your account when you verify the OTP.
          </p>
          <Link href="/login" className="font-semibold text-[#BF0637] hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
