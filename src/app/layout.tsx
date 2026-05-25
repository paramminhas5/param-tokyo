import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paramminhas.com"),
  title: {
    default: "Param Minhas — Founder & Operator",
    template: "%s · Param Minhas",
  },
  description:
    "Param Minhas — 15 years of building across e-commerce, real estate, conversational AI, sneaker culture, and AI-native marketing.",
  authors: [{ name: "Param Minhas" }],
  openGraph: {
    title: "Param Minhas — Playable Résumé",
    description: "15 years of building. Play the resume.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@paramminhas",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050310",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="console" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
