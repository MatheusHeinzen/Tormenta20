import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
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
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        <SheetProvider>
          <div className="min-h-screen overflow-x-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] paper-texture text-ink">
            {children}
          </div>
        </SheetProvider>
      </body>
    </html>
  );
}
