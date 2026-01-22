import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Montserrat,
  Bangers,
  Inter,
  Rock_Salt,
  Poppins,
} from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import Script from "next/script";

import { Bungee_Shade } from "next/font/google";

const bungeeshade = Bungee_Shade({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungeeshade",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mont = Montserrat({
  variable: "--font-mont",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
});

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const rockSalt = Rock_Salt({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rocksalt",
});

export const metadata: Metadata = {
  title: "Texus'26",
  description: "Texus'26",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${mont.variable} dark ${geistMono.variable} ${bangers.className} ${inter.variable} ${montserrat.variable} ${rockSalt.variable} ${bungeeshade.variable} ${poppins.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="32x32" />
        <Script
          src="https://unpkg.com/lenis@1.1.20/dist/lenis.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning className="font-sans">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
