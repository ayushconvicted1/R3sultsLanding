import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import CartProviderWithDrawer from "@/components/CartProviderWithDrawer";
import ToastProvider from "@/components/ToastProvider";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { AuthProvider } from "@/context/AuthContext";
import { MerchCartProvider } from "@/context/MerchCartContext";
import { CMSContentProvider } from "@/context/CMSContentContext";
import GoogleAuthProvider from "@/components/auth/GoogleAuthProvider";
import { CMSData } from "@/types/cms";
import DynamicFontLoader from "@/components/DynamicFontLoader";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "R3sults — Saving Lives in Disaster Using Technology & AI",
  description:
    "An end-to-end Disaster Management platform that saves lives through real-time intel, proactive alerts, and immediate response.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialCMSData: CMSData | null = null;
  try {
    const domain = process.env.NEXT_PUBLIC_DOMAIN_NAME || process.env.API_URL || "http://localhost:5001";
    const res = await fetch(`${domain}/api/landing-content/full`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        initialCMSData = json.data;
      }
    }
  } catch (err) {
    console.error("Error fetching initial CMS data in layout:", err);
  }

  return (
    <html
      lang="en"
      className={`${geist.variable} ${plusJakartaSans.variable}`}
    >
      <body className="antialiased bg-white text-slate-900 font-plus-jakarta-sans">
        <DynamicFontLoader />
        <ToastProvider>
          <GoogleAuthProvider>
            <AuthProvider>
              <MerchCartProvider>
                <CMSContentProvider initialData={initialCMSData}>
                  <CartProviderWithDrawer>
                    <Header />
                    <main>{children}</main>
                    <ScrollToTopButton />
                  </CartProviderWithDrawer>
                </CMSContentProvider>
              </MerchCartProvider>
            </AuthProvider>
          </GoogleAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
