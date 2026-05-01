import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Store | Premium E-commerce Platform",
  description: "Experience the next generation of online shopping with our premium platform. Built for excellence, designed for you.",
  keywords: ["shopping", "ecommerce", "nextjs", "premium", "online store"],
  authors: [{ name: "Easy Store Team" }],
  openGraph: {
    title: "Easy Store | Premium E-commerce Platform",
    description: "Experience the next generation of online shopping with our premium platform.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-grid"></div>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
