import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "text-base": "var(--text-base)",
        "text-description": "var(--text-description)",
        "primary": "var(--primary)",
      },
    },
  },
  plugins: [],
};
export default config;
