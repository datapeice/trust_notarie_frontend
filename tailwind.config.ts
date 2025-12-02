import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        background: "#242424", // Ubuntu Dark BG
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#38ef7d", // Ubuntu Green
          foreground: "#242424",
        },
        secondary: {
          DEFAULT: "#2D2D2D", // Card BG
          foreground: "#38ef7d",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#3C3C3C",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#2D2D2D",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#2D2D2D",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#2D2D2D",
          foreground: "#ffffff",
        },
        ubuntu: {
          orange: "#E95420",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Ubuntu", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
