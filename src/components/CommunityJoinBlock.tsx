"use client";

import { FormEvent, useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import { toast } from "react-toastify";
import { US_STATES } from "@/lib/us-states";
import { useCMSContent } from "@/context/CMSContentContext";

const BASE_URL =
  (process.env.NEXT_PUBLIC_USER_API_BASE_URL ||
    process.env.NEXT_PUBLIC_DOMAIN_NAME ||
    process.env.USER_API_BASE_URL ||
    "").replace(/\/+$/, "");

const inputClass =
  "w-full rounded-lg border border-slate-600/80 bg-slate-900/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#BF0637] focus:outline-none focus:ring-2 focus:ring-[#BF0637]/25";

const labelClass = "block text-xs font-medium text-slate-300 mb-1.5";

export default function CommunityJoinBlock() {
  const { data } = useCMSContent();
  const communityData = data?.home.communitySection;
  
  const formId = useId();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const initCaptcha = useCallback(() => {
    setTimeout(() => {
      try {
        loadCaptchaEnginge(6, "#1e293b", "#f8fafc", "upper");
      } catch {
        /* canvas not ready yet */
      }
    }, 50);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    initCaptcha();
  }, [modalOpen, initCaptcha]);

  function getApiUrl(path: string) {
    if (BASE_URL) return `${BASE_URL}${path}`;
    return path;
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  useEffect(() => {
    const t = captchaInput.trim().toUpperCase();
    if (!t) {
      setCaptchaOk(false);
      return;
    }
    const ok = validateCaptcha(t, false);
    setCaptchaOk(ok);
  }, [captchaInput]);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFirstName("");
    setLastName("");
    setPhone(undefined);
    setState("");
    setEmail("");
    setCaptchaInput("");
    setCaptchaOk(false);
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    if (!fn || !ln) {
      toast.error("Please enter your first and last name.");
      return;
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!state) {
      toast.error("Please select your state.");
      return;
    }
    if (!isValidEmail(em)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validateCaptcha(captchaInput.trim().toUpperCase(), true)) {
      toast.error("Captcha does not match. Try again.");
      setCaptchaOk(false);
      setCaptchaInput("");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em }),
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(resData?.message || "Failed to join");
      const message = resData?.message || "You’re in — welcome to the community.";
      toast.success(message);
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!communityData) return null;

  return (
    <>
      <div className="mt-0 flex flex-col gap-3 w-full max-w-full min-w-0">
        <p className="text-slate-200 text-sm mt-0 mb-0">
          {communityData.card.joinTrigger.helperText}
        </p>
        <div className="flex items-center gap-2">
          <input
            id={`${formId}-community-email-trigger`}
            type="email"
            readOnly
            onFocus={openModal}
            onClick={openModal}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            className="h-10 min-w-0 flex-1 cursor-pointer px-4 rounded-md bg-white/10 text-white placeholder:text-slate-300 text-base leading-tight border border-white/20 focus:outline-none focus:border-white/50"
            placeholder={communityData.card.joinTrigger.inputPlaceholder}
          />
          <button
            type="button"
            onClick={openModal}
            className="h-10 bg-[#BF0637] px-4 rounded-md text-white text-sm inline-flex items-center gap-2 min-w-[110px] shrink-0 justify-center whitespace-nowrap hover:opacity-95"
          >
            {communityData.card.joinTrigger.buttonLabel}
          </button>
        </div>
      </div>

      {mounted && modalOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
              role="presentation"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                aria-label="Close"
                onClick={closeModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${formId}-community-title`}
                className="relative z-[10001] mx-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-linear-to-b from-slate-900 to-slate-950 p-5 sm:p-6 shadow-2xl"
              >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h4
                  id={`${formId}-community-title`}
                  className="text-lg font-semibold text-white"
                >
                  {communityData.card.joinModal.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {communityData.card.joinModal.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleJoin} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-first`} className={labelClass}>
                    {communityData.card.joinModal.fields.firstNameLabel}
                  </label>
                  <input
                    id={`${formId}-first`}
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-last`} className={labelClass}>
                    {communityData.card.joinModal.fields.lastNameLabel}
                  </label>
                  <input
                    id={`${formId}-last`}
                    className={inputClass}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-phone`} className={labelClass}>
                  {communityData.card.joinModal.fields.phoneLabel}
                </label>
                <div
                  className="[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:rounded-lg [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-slate-600/80 [&_.PhoneInputInput]:bg-slate-900/80 [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-2.5 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:text-white [&_.PhoneInputCountry]:border [&_.PhoneInputCountry]:border-slate-600/80 [&_.PhoneInputCountry]:rounded-lg [&_.PhoneInputCountry]:bg-slate-900/80"
                >
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phone}
                    onChange={setPhone}
                    className="w-full"
                    placeholder="Enter phone number"
                    numberInputProps={{
                      id: `${formId}-phone`,
                      required: true,
                      className: "!text-white !bg-transparent",
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-state`} className={labelClass}>
                  {communityData.card.joinModal.fields.stateLabel}
                </label>
                <select
                  id={`${formId}-state`}
                  className={inputClass}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                >
                  <option value="">{communityData.card.joinModal.fields.statePlaceholder}</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${formId}-email`} className={labelClass}>
                  {communityData.card.joinModal.fields.emailLabel}
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="rounded-xl border border-slate-600/60 bg-slate-900/50 p-3">
                <label className={labelClass}>{communityData.card.joinModal.fields.captchaTitle}</label>
                <div className="captcha-wrap text-slate-200 text-sm [&_a]:text-cyan-400 [&_a]:underline">
                  <LoadCanvasTemplate reloadText="New code" reloadColor="#22d3ee" />
                </div>
                <label htmlFor={`${formId}-captcha`} className={`${labelClass} mt-3`}>
                  {communityData.card.joinModal.fields.captchaPlaceholder || "Enter the characters shown"}
                </label>
                <input
                  id={`${formId}-captcha`}
                  className={inputClass}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  autoComplete="off"
                  placeholder="Match letters (uppercase)"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !captchaOk ||
                  !firstName.trim() ||
                  !lastName.trim() ||
                  !phone ||
                  !state ||
                  !email.trim()
                }
                className="w-full py-3 rounded-lg font-semibold text-white bg-[#BF0637] hover:opacity-95 transition-opacity disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {communityData.card.joinModal.buttonLoadingLabel || "Joining…"}
                  </span>
                ) : (
                  communityData.card.joinModal.buttonLabel || "Join"
                )}
              </button>
            </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
