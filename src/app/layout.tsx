import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vectorflow — Interactive Linear Algebra",
  description:
    "An interactive, visual course on linear algebra. Learn vectors, spaces, and transformations through simulations and intuition-first lessons.",
  keywords: [
    "linear algebra",
    "vectors",
    "interactive learning",
    "math",
    "3Blue1Brown",
    "brilliant",
  ],
  authors: [{ name: "Vectorflow" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <SonnerToaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            classNames: {
              toast:
                "bg-card border-border text-card-foreground shadow-2xl",
            },
          }}
        />
      </body>
    </html>
  );
}
