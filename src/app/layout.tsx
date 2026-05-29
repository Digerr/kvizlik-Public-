import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "КВИЗЛИК — Проверь свои знания!",
  description: "Квиз-игра для Telegram и VK. 8 категорий, 80+ вопросов, лиги и рейтинги!",
  keywords: ["квиз", "викторина", "trivia", "telegram", "vk", "mini app", "игра", "знания"],
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0a1e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning class="dark">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        <script src="https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--theme-bg)] text-foreground select-none`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
