

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Removing the unused import
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApolloContextProvider } from "@/contexts/ApolloContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",

});

export const metadata: Metadata = {
  title: "TrustBridge",
  description: "Decentralized platform for P2P microloans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppProvider>
          <AuthProvider>
            <ApolloContextProvider>
              {children}
            </ApolloContextProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
