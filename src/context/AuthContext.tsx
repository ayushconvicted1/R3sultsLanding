"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppUser } from "@/types/user";

export type { AppUser };

type AuthContextValue = {
  user: AppUser | null;
  token: string | null;
  loading: boolean;
  needsPhoneUpdate: boolean;
  clearNeedsPhoneUpdate: () => void;
  loginWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ error?: string; needsPhoneUpdate?: boolean }>;
  register: (params: {
    phoneNumber: string;
    password: string;
    fullName: string;
    email?: string;
    username?: string;
  }) => Promise<{ error?: string }>;
  sendOtp: (phoneNumber: string) => Promise<{ error?: string }>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<{ error?: string }>;
  updatePhone: (phoneNumber: string) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AUTH_TOKEN_KEY = "r3sults_auth_token";
const REFRESH_TOKEN_KEY = "r3sults_refresh_token";
const AuthContext = createContext<AuthContextValue | null>(null);

const NEEDS_PHONE_UPDATE_KEY = "r3sults_needs_phone_update";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPhoneUpdate, setNeedsPhoneUpdateState] = useState(false);

  const setToken = useCallback((t: string | null) => {
    if (typeof window === "undefined") return;
    if (t) localStorage.setItem(AUTH_TOKEN_KEY, t);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
    setTokenState(t);
  }, []);

  const setRefreshToken = useCallback((t: string | null) => {
    if (typeof window === "undefined") return;
    if (t) localStorage.setItem(REFRESH_TOKEN_KEY, t);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  const clearNeedsPhoneUpdate = useCallback(() => {
    setNeedsPhoneUpdateState(false);
    if (typeof window !== "undefined") localStorage.removeItem(NEEDS_PHONE_UPDATE_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!t) {
      setUser(null);
      setTokenState(null);
      setLoading(false);
      return;
    }
    setTokenState(t);
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        const refresh = typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
        if (res.status === 401 && refresh) {
          const refreshRes = await fetch("/api/auth/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refresh }),
          });
          const refreshData = await refreshRes.json();
          if (refreshRes.ok && refreshData.success !== false && refreshData.accessToken) {
            setToken(refreshData.accessToken);
            if (refreshData.refreshToken) setRefreshToken(refreshData.refreshToken);
            const meRes = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${refreshData.accessToken}` },
            });
            if (meRes.ok) {
              const meData = await meRes.json();
              setUser(meData.user);
            }
            setLoading(false);
            return;
          }
        }
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setUser(null);
        setTokenState(null);
      }
    } catch {
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, [setToken, setRefreshToken]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(NEEDS_PHONE_UPDATE_KEY)) {
      setNeedsPhoneUpdateState(true);
    }
    const t = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!t) {
      setLoading(false);
      return;
    }
    setTokenState(t);
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => {
        setUser(null);
        setTokenState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error || "Login failed" };
        if (data.accessToken) setToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        if (data.user) setUser(data.user);
        return {};
      } catch {
        return { error: "Login failed" };
      }
    },
    [setToken, setRefreshToken]
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error || "Google sign-in failed" };
        if (data.accessToken) setToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        if (data.user) setUser(data.user);
        if (data.needsPhoneUpdate) {
          setNeedsPhoneUpdateState(true);
          if (typeof window !== "undefined") localStorage.setItem(NEEDS_PHONE_UPDATE_KEY, "1");
        }
        return { needsPhoneUpdate: !!data.needsPhoneUpdate };
      } catch {
        return { error: "Google sign-in failed" };
      }
    },
    [setToken, setRefreshToken]
  );

  const register = useCallback(
    async (params: {
      phoneNumber: string;
      password: string;
      fullName: string;
      email?: string;
      username?: string;
    }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: params.phoneNumber.trim(),
            password: params.password,
            fullName: params.fullName.trim(),
            ...(params.email?.trim() && { email: params.email.trim() }),
            ...(params.username?.trim() && { username: params.username.trim() }),
          }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error || "Registration failed" };
        return {};
      } catch {
        return { error: "Registration failed" };
      }
    },
    []
  );

  const sendOtp = useCallback(async (phoneNumber: string) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Failed to send OTP" };
      return {};
    } catch {
      return { error: "Failed to send OTP" };
    }
  }, []);

  const verifyOtp = useCallback(
    async (phoneNumber: string, otp: string) => {
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, otp }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error || "Invalid OTP" };
        setToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        setUser(data.user);
        clearNeedsPhoneUpdate();
        return {};
      } catch {
        return { error: "Verification failed" };
      }
    },
    [setToken, setRefreshToken, clearNeedsPhoneUpdate]
  );

  const updatePhone = useCallback(async (phoneNumber: string) => {
    try {
      const t = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      if (!t) return { error: "Not authenticated" };
      const res = await fetch("/api/auth/update-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Failed to send OTP" };
      return {};
    } catch {
      return { error: "Failed to update phone" };
    }
  }, []);

  const logout = useCallback(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (t) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${t}` },
      }).catch(() => {});
    }
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    clearNeedsPhoneUpdate();
  }, [setToken, setRefreshToken, clearNeedsPhoneUpdate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      needsPhoneUpdate,
      clearNeedsPhoneUpdate,
      loginWithPassword,
      loginWithGoogle,
      register,
      sendOtp,
      verifyOtp,
      updatePhone,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      loading,
      needsPhoneUpdate,
      clearNeedsPhoneUpdate,
      loginWithPassword,
      loginWithGoogle,
      register,
      sendOtp,
      verifyOtp,
      updatePhone,
      logout,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
