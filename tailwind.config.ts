import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.4", filter: "blur(80px)" },
          "33%": { transform: "translate(50px, -80px) scale(1.1)", opacity: "0.6", filter: "blur(120px)" },
          "66%": { transform: "translate(-40px, 40px) scale(0.9)", opacity: "0.5", filter: "blur(100px)" },
          "100%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.4", filter: "blur(80px)" },
        },
        "spectrum-glow": {
          "0%, 100%": { opacity: "0.5", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.5)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blob: "blob 20s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "spectrum-glow": "spectrum-glow 8s ease-in-out infinite",
        flip: "flip 1s ease-out forwards",
        highlight: "highlight 3s infinite linear"
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fluid: "cubic-bezier(0.23, 1, 0.32, 1)",
        expo: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
