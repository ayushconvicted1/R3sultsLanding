"use client";
import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      // Simulate async submit (replace with real API call if desired)
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <>
      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          aria-label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-white/10 text-white placeholder:text-slate-300"
          placeholder="Enter your email"
        />
        <button
          className="bg-pink-600 px-4 py-2 rounded text-white"
          type="submit"
        >
          {status === "loading" ? "..." : "Submit"}
        </button>
      </form>
      {status === "success" && (
        <div className="mt-2 text-sm text-green-400">
          Thanks — we'll be in touch.
        </div>
      )}
      {status === "error" && (
        <div className="mt-2 text-sm text-rose-400">
          Something went wrong. Try again.
        </div>
      )}
    </>
  );
}
