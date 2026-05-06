import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        panel: "#11141b",
        border: "#1f2430",
        accent: "#22c55e",
        danger: "#ef4444",
        muted: "#7b8497",
      },
    },
  },
  plugins: [],
};
export default config;
