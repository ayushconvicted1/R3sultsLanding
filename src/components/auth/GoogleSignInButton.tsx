"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const buttonLabel: Record<string, string> = {
  signin_with: "Sign in with Google",
  signup_with: "Sign up with Google",
  continue_with: "Continue with Google",
};

type Props = {
  /** "signin_with" (default) or "signup_with" for button wording */
  text?: "signin_with" | "signup_with" | "continue_with";
  className?: string;
  onSuccessRedirect?: string;
};

export default function GoogleSignInButton({
  text = "signin_with",
  className = "",
  onSuccessRedirect = "/dashboard",
}: Props) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        toast.error("Google sign-in failed: no credential");
        return;
      }
      setLoading(true);
      const result = await loginWithGoogle(idToken);
      setLoading(false);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Signed in with Google!");
      if (result.needsPhoneUpdate) {
        router.push("/update-phone");
      } else {
        router.push(onSuccessRedirect);
      }
    },
    [loginWithGoogle, onSuccessRedirect, router]
  );

  const handleError = useCallback(() => {
    toast.error("Google sign-in was cancelled or failed");
  }, []);

  const handleNotConfigured = useCallback(() => {
    toast.info(
      "Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local (from Google Cloud Console) and restart the dev server."
    );
  }, []);

  return (
    <div className={className}>
      {clientId ? (
        <div className="min-h-[40px] flex items-center justify-center [&>div]:min-w-full [&>div]:flex [&>div]:justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            use_fedcm_for_prompt
            theme="outline"
            size="large"
            type="standard"
            shape="rectangular"
            width="100%"
            text={text}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleNotConfigured}
          className="w-full h-10 px-4 flex items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637]"
          aria-label={buttonLabel[text] ?? "Sign in with Google"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {buttonLabel[text] ?? "Sign in with Google"}
        </button>
      )}
      {loading && (
        <p className="mt-2 text-center text-sm text-slate-500">Signing in…</p>
      )}
    </div>
  );
}
