import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair-display)"],
        questrial: ["var(--font-questrial)"],
        "fragment-mono": ["var(--font-fragment-mono)"],
        inter: ["var(--font-inter)"],
        spaceGrotesk: ["var(--font-spaceGrotesk)"],
      },
      animation: {
        "loading-bar": "loading 2s linear infinite",
        'blob-wide': "blob-wide 20s infinite",
      },
      keyframes: {
        loading: {
          "0%": { left: "-50%" },
          "100%": { left: "100%" },
        },
        'blob-wide': {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(calc(100vw * 0.3), calc(100vh * -0.3)) scale(1.1)",
          },
          "66%": {
            transform: "translate(calc(100vw * -0.2), calc(100vh * 0.2)) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
	nextui()
  ],
  variants: {
    extend: {
      animation: ["responsive", "motion-safe", "motion-reduce"],
    },
  },
};
export default config;