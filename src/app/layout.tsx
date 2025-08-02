import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Green Energy Solutions - Premium Inverters & Batteries",
  description: "Shop premium quality inverters, batteries, and solar solutions at Green Energy Solutions. Trusted brands, competitive prices, and exceptional service.",
  keywords: ["Green Energy Solutions", "inverters", "batteries", "solar solutions", "Amaron", "Exide", "Luminous", "energy solutions"],
  authors: [{ name: "Green Energy Solutions" }],
  openGraph: {
    title: "Green Energy Solutions - Premium Inverters & Batteries",
    description: "Shop premium quality inverters, batteries, and solar solutions at Green Energy Solutions.",
    url: "https://greenenergysolutions.com",
    siteName: "Green Energy Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Energy Solutions - Premium Inverters & Batteries",
    description: "Shop premium quality inverters, batteries, and solar solutions at Green Energy Solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
