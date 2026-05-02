import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElixaTech | Premium E-commerce Platform",
  description: "A premium shopping experience powered by ElixaTech.",
  keywords: ["shopping", "ecommerce", "nextjs", "premium", "online store"],
  authors: [{ name: "ElixaTech Team" }],
  openGraph: {
    title: "ElixaTech | Premium E-commerce Platform",
    description: "Experience the next generation of online shopping with our premium platform.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

import { ToastProvider } from "@/components/Toast";
import { CartProvider } from "@/context/CartContext";
import { FavoriteProvider } from "@/context/FavoriteContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-grid"></div>
        <ToastProvider>
          <CartProvider>
            <FavoriteProvider>
              <Navbar />
              {children}
            </FavoriteProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
