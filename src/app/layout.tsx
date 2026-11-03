import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Instrument_Sans, Martian_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/* next/font descarga y autoaloja las familias: sin petición a Google en
   tiempo de ejecución y sin salto de texto al cargar. Cada una expone su
   propia variable; globals.css las mapea a --font-display / -body / -mono. */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body-src",
  display: "swap",
});
const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f2f1ed" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${instrument.variable} ${martian.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
