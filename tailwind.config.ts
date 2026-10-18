import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salino: {
          obsidian: "#000000",
          charcoal: "#1F2326",
          surface: "#121517",
          elevated: "#262B2F",
          alabaster: "#EDEAE4",
          stone: "#9A9690",
          copper: {
            DEFAULT: "#B8522E",
            hover: "#D16038",
            muted: "rgba(184, 82, 46, 0.15)",
            border: "rgba(184, 82, 46, 0.35)",
          },
        },
      },
      borderRadius: {
        salino: "18px",
      },
      letterSpacing: {
        subtitle: "0.32em",
      },
      boxShadow: {
        "copper-glow": "0 0 24px -4px rgba(184, 82, 46, 0.4)",
        "card-subtle": "0 8px 30px rgba(0, 0, 0, 0.6)",
      },
      fontFamily: {
        ar: ["var(--font-readex)", "sans-serif"],
        en: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
