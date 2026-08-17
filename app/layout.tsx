import type { Metadata } from "next";
import { Geist, Instrument_Serif, Caveat } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "A Surprise For You",
  description: "A small personal project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable} ${caveat.variable}`}>
      <body className="font-sans text-text-primary bg-bg antialiased selection:bg-accent/20 selection:text-text-primary min-h-[100dvh] flex flex-col">
        <main className="flex-grow flex flex-col relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
