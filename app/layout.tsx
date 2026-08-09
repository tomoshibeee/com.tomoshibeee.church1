import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// メタデータの設定（タイトルや日本語対応を調整）
export const metadata: Metadata = {
  title: {
    default: "Omisee - オミシー",
    template: "%s | Omisee",
  },
  description: "Omisee（オミシー）の公式サイトです。",
  metadataBase: new URL("https://omisee.tomoshibeee.com"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 構造化データオブジェクト
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Omisee",
    "alternateName": ["オミシー"],
    "url": "https://omisee.tomoshibeee.com/",
  };

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Next.js推奨のJSON-LD埋め込み方法 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}