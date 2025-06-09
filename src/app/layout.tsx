import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/providers/global.provider";
import { Toaster } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustBridge",
  description:
    "TrustBridge is a decentralized platform designed to facilitate P2P microloans securely, transparently, and efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProvider>
          <SimpleHeader />
          <main className="pt-16">
            {children}
          </main>
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}