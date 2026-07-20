import { Noto_Sans_Georgian, Open_Sans, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import localFont from "next/font/local";

export const cabinetGrotesk = localFont({
  src: [
    { path: "./fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-cabinet",
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const spaceMono = Space_Mono({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

export const notoSansGeorgian = Noto_Sans_Georgian({
  weight: ["400", "500", "700"],
  subsets: ["georgian"],
  display: "swap",
  variable: "--font-noto-sans-georgian",
});

export const openSans = Open_Sans({
  weight: ["400", "500", "700"],
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-open-sans",
});
