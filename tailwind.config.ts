import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-onsite)"],
        secondary: ["var(--font-monument)"],
      },
      colors: {
        primary: "#a4ff00",
        secondary: "#bfbfbf",
        tertiary: "#0a0a0a",
        grid: "#252525",
        footer: "#04ad5a",
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        slideIn: "slideInFromLeft 0.5s forwards",
        slideOut: "slideOutToRight 0.5s forwards",
        autoRun: "autoRun 10s linear infinite",
        autoRightRun: "autoRightRun 10s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },

        autoRun: {
          from: { left: "100%" },
          to: { left: "calc(200px * -1)" },
        },

        autoRightRun: {
          from: { right: "100%" },
          to: { right: "calc(200px * -1)" },
        },

        slideInFromLeft: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0%)" },
        },

        slideOutToRight: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;