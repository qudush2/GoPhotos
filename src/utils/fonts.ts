import {
  Playfair_Display as PlayfairDisplay,
  Questrial,
  Fragment_Mono,
  Inter,
  Space_Grotesk as SpaceGrotesk,
} from "next/font/google";

export const playfairDisplay = PlayfairDisplay({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "700"],
  variable: "--font-playfair-display",
});

export const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-questrial",
});

export const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export const spaceGrotesk = SpaceGrotesk({
  style: "normal",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});
