import type { Metadata } from "next";
import { Cabin, Rajdhani } from "next/font/google";
import localFont from "next/font/local";
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

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cabin",
});

const lato = localFont({
  src: [
    {
      path: "../../public/fonts/Lato/Lato-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato/Lato-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/Lato/Lato-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato/Lato-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Lato/Lato-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato/Lato-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Lato/Lato-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato/Lato-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Lato/Lato-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Lato/Lato-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-lato",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
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
      className={`${cabin.variable} ${lato.variable} ${rajdhani.variable}`}
    >
      <body className="antialiased bg-white text-slate-900 font-cabin">
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
