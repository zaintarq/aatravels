import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#F9EAF1",
          100: "#F3D0E1",
          200: "#E8A1C4",
          300: "#DA6FA5",
          400: "#C64788",
          500: "#930047", // primary (from logo)
          600: "#7F003E",
          700: "#690033",
          800: "#530028",
          900: "#3C001D",
          950: "#270013",
        },
        gold: {
          50: "#FDF7FA",
          100: "#FBEFF5",
          200: "#F7DDEB",
          300: "#F1C7DE",
          400: "#E8A6CC", // accent
          500: "#D97CB3",
          600: "#BE5495",
          700: "#9A3D77",
          800: "#73295A",
          900: "#4D173C",
        },
        ink: {
          50: "#F7F7F8",
          100: "#ECECF0",
          400: "#54545F",
          700: "#232329",
          800: "#18181C",
          900: "#111114",
          950: "#0A0A0C",
        },
        cream: "#F6F4F5",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        brand: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
