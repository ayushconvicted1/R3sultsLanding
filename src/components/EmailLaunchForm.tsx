"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface EmailLaunchFormProps {
  source: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const TOAST_MESSAGE = "We have received your email for newsletter subscription.";

export default function EmailLaunchForm({
  source,
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: EmailLaunchFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email?.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      if (!res.ok) throw new Error("Failed");
      setEmail("");
      toast.success(TOAST_MESSAGE);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClassName}
        required
        disabled={loading}
      />
      <button type="submit" className={buttonClassName} disabled={loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
