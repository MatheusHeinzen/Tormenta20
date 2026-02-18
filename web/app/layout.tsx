import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SheetProvider } from "@/context/SheetContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ficha Editável Tormenta 20",
  description: "Crie, edite e use fichas de personagem diretamente no navegador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-PLACEHOLDER';

  return (
    <html lang="pt-BR">
      <head>
        {/* Google AdSense */}
        {adSenseClientId !== 'ca-pub-PLACEHOLDER' && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (adsbygoogle = window.adsbygoogle || []).push({
                  google_ad_client: "${adSenseClientId}",
                  enable_page_level_ads: false
                });
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        <SheetProvider>
          <div className="min-h-screen overflow-x-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] paper-texture text-ink">
            {children}
          </div>
        </SheetProvider>
        <Analytics />
        {/* AdSense script */}
        {adSenseClientId !== 'ca-pub-PLACEHOLDER' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
