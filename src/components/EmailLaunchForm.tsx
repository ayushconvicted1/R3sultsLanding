"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useCMSContent } from "@/context/CMSContentContext";

interface EmailLaunchFormProps {
  source: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export default function EmailLaunchForm({
  source,
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: EmailLaunchFormProps) {
  const { data } = useCMSContent();
  const formData = data?.shared.forms.emailLaunchForm;
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email?.trim() || !formData) return;
    
    setLoading(true);
    try {
      const { endpoint, method } = formData.api;
      
      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      
      if (!res.ok) throw new Error("Failed");
      
      setEmail("");
      toast.success(formData.successToast);
    } catch {
      toast.error(formData.errorToast);
    } finally {
      setLoading(false);
    }
  }

  if (!formData) return null;

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder={formData.inputPlaceholder}
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
            {formData.buttonLoadingLabel}
          </span>
        ) : (
          formData.buttonLabel
        )}
      </button>
    </form>
  );
}
