import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "OPS Logistics - Global Shipping Solutions",
  description: "Reliable logistics and shipping solutions for businesses worldwide. Track shipments in real-time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <LanguageProvider>
          <Header />
          <main className="flex-grow w-full mx-auto max-w-full">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
