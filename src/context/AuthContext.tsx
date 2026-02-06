"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface UserAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: UserAddress;
}

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (data: SignupData) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: UserAddress;
}

const AUTH_TOKEN_KEY = "r3sults_auth_token";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((t: string | null) => {
    if (typeof window === "undefined") return;
    if (t) localStorage.setItem(AUTH_TOKEN_KEY, t);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
    setTokenState(t);
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
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
        setTokenState(null);
      }
    } catch {
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!t) {
      setLoading(false);
      return;
    }
    setTokenState(t);
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => {
        if (res.ok) return res.json();
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setTokenState(null);
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

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error || "Login failed" };
        setToken(data.token);
        setUser(data.user);
        return {};
      } catch {
        return { error: "Login failed" };
      }
    },
    [setToken]
  );

  const signup = useCallback(
    async (data: SignupData) => {
      try {
        const body = {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? "",
          line1: data.address?.line1 ?? "",
          line2: data.address?.line2 ?? "",
          city: data.address?.city ?? "",
          state: data.address?.state ?? "",
          postalCode: data.address?.postalCode ?? "",
          country: data.address?.country ?? "US",
        };
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) return { error: json.error || "Signup failed" };
        setToken(json.token);
        setUser(json.user);
        return {};
      } catch {
        return { error: "Signup failed" };
      }
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, signup, logout, refreshUser }),
    [user, token, loading, login, signup, logout, refreshUser]
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
