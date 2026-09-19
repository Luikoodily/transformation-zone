import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { MotionConfig } from "motion/react";
import { location } from "@/data/location";
import { coach } from "@/data/coach";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// TODO: confirm final domain before launch
const siteUrl = "https://transformationzone.example";
const title = `${location.name} | Personal Training & Strength Coaching`;
const description = `Personalized strength, conditioning & transformation coaching with ${coach.name} at ${location.name}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: location.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${manrope.variable} antialiased`}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
