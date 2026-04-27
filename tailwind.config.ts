import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          muted: "var(--brand-gold-soft)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        brand: {
          deep: "var(--brand-deep-blue)",
          "deep-soft": "var(--brand-deep-blue-soft)",
          black: "var(--brand-black)",
          gold: "var(--brand-gold)",
        },
        metal: {
          bronze: "var(--metal-bronze)",
          "bronze-strong": "var(--metal-bronze-strong)",
          "bronze-soft": "var(--metal-bronze-soft)",
          "bronze-faint": "var(--metal-bronze-faint)",
        },
        tone: {
          strong: "var(--font-strong)",
          body: "var(--font-body)",
          soft: "var(--font-soft)",
          sky: "var(--font-sky)",
        },
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};
export default config;
