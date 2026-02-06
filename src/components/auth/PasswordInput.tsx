"use client";

import { useState } from "react";

const inputBase =
  "w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const inputError = "border-red-300 focus:border-red-500 focus:ring-red-200";
const inputNormal = "border-slate-200 focus:border-[#BF0637]";

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  className = "",
  error,
  "aria-describedby": ariaDescribedby,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  error?: string;
  "aria-describedby"?: string;
}) {
  const [show, setShow] = useState(false);
  const hasError = Boolean(error);

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedby}
        className={`${inputBase} ${hasError ? inputError : inputNormal} ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#BF0637]/30"
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {show ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
      {error && (
        <p id={ariaDescribedby} className="mt-1.5 text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
