import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MRK Tradex · Protection, engineered for every pump",
  description:
    "MRK Tradex pump starters, control panels, smart plugs, cables and accessories.",
};

const themeVariables = {
  "--ink": "11 31 51",
  "--deep": "18 49 94",
  "--paper": "246 249 252",
  "--mist": "234 241 248",
  "--card": "255 255 255",
  "--line": "220 230 240",
  "--aqua": "30 155 224",
  "--marine": "14 107 176",
  "--splash": "95 198 236",
  "--cream": "241 236 227",
  "--cream-line": "219 211 196",
  "--muted": "93 116 136",
} as CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth motion-reduce:scroll-auto" style={themeVariables}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden bg-paper font-sans leading-[1.65] text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
