"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const TOAST_MESSAGE = "We have received your email for newsletter subscription.";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email?.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "newsletter" }),
      });
      if (!response.ok) throw new Error("Failed to submit email");
      setEmail("");
      toast.success(TOAST_MESSAGE);
    } catch (err) {
      console.error("Error submitting email:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
      <input
        aria-label="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-3 py-2 rounded bg-white/10 text-white placeholder:text-slate-300"
        placeholder="Enter your email"
        disabled={loading}
      />
      <button
        className="bg-[#BF0637] px-4 py-2 rounded text-white inline-flex items-center gap-2 min-w-[100px] justify-center"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
