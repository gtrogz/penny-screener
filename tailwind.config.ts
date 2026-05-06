import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070810",
        panel: "rgba(20, 22, 32, 0.7)",
        panelSolid: "#11141d",
        border: "rgba(255, 255, 255, 0.08)",
        borderHi: "rgba(255, 255, 255, 0.14)",
        muted: "#8a93a6",
      