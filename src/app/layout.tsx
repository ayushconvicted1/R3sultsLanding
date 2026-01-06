import type { Metadata } from "next";
import { Cabin, Lato } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cabin",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "R.sults — Saving Lives in Disaster Using Technology & AI",
  description:
    "An end-to-end Disaster Management platform that saves lives through real-time intel, proactive alerts, and immediate response.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cabin.variable} ${lato.variable}`}>
      <body className="antialiased bg-white text-slate-900">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
