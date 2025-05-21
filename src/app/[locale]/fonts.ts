import { Roboto, Noto_Sans_Georgian, Open_Sans } from "next/font/google";

// Define Roboto for English
export const roboto = Roboto({
  weight: ["400", "500", "700"], // Specify weights you need
  subsets: ["latin", "cyrillic-ext"], // Specify subsets
  display: "swap", // Font display strategy
  variable: "--font-roboto", // Optional: if you want to use CSS variables
});

// Define Noto Sans Georgian for Georgian
export const notoSansGeorgian = Noto_Sans_Georgian({
  weight: ["400", "500", "700"],
  subsets: ["georgian"],
  display: "swap",
  variable: "--font-noto-sans-georgian",
});

// Define Open Sans for Russian
export const openSans = Open_Sans({
  weight: ["400", "500", "700"],
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-open-sans",
});
