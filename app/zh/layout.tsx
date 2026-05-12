import type { Metadata } from "next";
import { IBM_Plex_Mono, Literata } from "next/font/google";
import "../globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Patch Signal - Steam 和独立游戏攻略",
    template: "%s | Patch Signal"
  },
  description: "在 Wiki 追上来之前，最快获取 Steam 和独立游戏的英文攻略。",
  metadataBase: new URL("https://patchsignal.com"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={`${ibmPlexMono.variable} ${literata.variable}`}>
      <head>
        <script
          defer
          data-domain="patchsignal.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
