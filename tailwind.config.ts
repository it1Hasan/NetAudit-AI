import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: "#dc2626",
        high: "#ea580c",
        medium: "#ca8a04",
        low: "#2563eb",
      },
    },
  },
  plugins: [],
};
export default config;
