"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const BASE_URL =
  (process.env.NEXT_PUBLIC_USER_API_BASE_URL ||
    process.env.NEXT_PUBLIC_DOMAIN_NAME ||
    process.env.USER_API_BASE_URL ||
    "").replace(/\/+$/, "");

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  function getApiUrl(path: string) {
    if (BASE_URL) return `${BASE_URL}${path}`;
    return path;
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function postNewsletter(path: string, payload: { email: string }) {
    const response = await fetch(getApiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    return { response, data };
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    if (!isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setStatusText("");
    try {
      const { response, data } = await postNewsletter("/api/newsletter/subscribe", {
        email: trimmedEmail,
      });
      if (!response.ok) throw new Error(data?.message || "Failed to subscribe");
      const message = data?.message || "Successfully subscribed to newsletter";
      setStatusText(message);
      toast.success(message);
    } catch (err) {
      console.error("Error submitting email:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-3 w-full max-w-full min-w-0" onSubmit={handleSubscribe}>
      <div className="flex items-center gap-2">
       
        <input
          aria-label="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 min-w-0 flex-1 px-4 rounded-md bg-white/10 text-white placeholder:text-slate-300 text-base leading-tight border border-white/20 focus:outline-none focus:border-white/50"
          placeholder="Enter your email"
          disabled={loading}
        />
         <button
          className="h-10 bg-[#BF0637] px-4 rounded-md text-white text-sm inline-flex items-center gap-2 min-w-[110px] shrink-0 justify-center whitespace-nowrap"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subscribing
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {statusText ? (
        <p className="text-xs text-white/90 mt-1">{statusText}</p>
      ) : null}
    </form>
  );
}
