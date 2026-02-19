import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "FichFlow — Créez vos fiches produit en 30 secondes",
    template: "%s — FichFlow",
  },
  description:
    "Créez des fiches produit professionnelles en quelques clics. Uploadez une photo, obtenez une fiche complète avec description, caractéristiques et export PDF.",
  keywords: [
    "fiche produit",
    "générateur fiche produit",
    "catalogue produit",
    "description produit",
    "PDF produit",
    "e-commerce",
    "fiche produit automatique",
    "FichFlow",
  ],
  authors: [
    {
      name: "Guyon Informatique & Web",
      url: "https://guyon-informatique-web.fr",
    },
  ],
  creator: "Guyon Informatique & Web",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "FichFlow",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
