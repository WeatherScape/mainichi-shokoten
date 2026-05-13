import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f6f1e8",
        wall: "#fffdf8",
        ink: "#27231d",
        muted: "#7b746a",
        line: "#ded6c8",
        sage: "#667761",
        clay: "#a46f52",
        night: "#2f3633"
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        hush: "0 18px 50px rgba(47, 54, 51, 0.08)",
        paper: "0 1px 0 rgba(47, 54, 51, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
