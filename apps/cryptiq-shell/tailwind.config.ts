import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}"
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Trading colors
        profit: "hsl(var(--profit))",
        loss: "hsl(var(--loss))",
        warning: "hsl(var(--warning))",
        trading: {
          bid: "hsl(var(--bid))",
          ask: "hsl(var(--ask))",
          spread: "hsl(var(--spread))",
          volume: "hsl(var(--volume))",
          depth: "hsl(var(--depth))"
        },
        chart: {
          gridLines: "hsl(var(--chart-grid))",
          crosshair: "hsl(var(--chart-crosshair))",
          background: "hsl(var(--chart-bg))",
          primary: "hsl(var(--chart-primary))",
          secondary: "hsl(var(--chart-secondary))",
          candle: {
            up: "hsl(var(--candle-up))",
            down: "hsl(var(--candle-down))",
            wick: "hsl(var(--candle-wick))"
          },
          volume: {
            up: "hsl(var(--volume-up))",
            down: "hsl(var(--volume-down))"
          },
          indicator: {
            primary: "hsl(var(--indicator-primary))",
            secondary: "hsl(var(--indicator-secondary))",
            tertiary: "hsl(var(--indicator-tertiary))"
          }
        }
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))"
      },
      scale: {
        '101': '1.01',
        '102': '1.02'
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85'
      },
      spacing: {
        'tick-xs': '0.125rem',  // 2px
        'tick-sm': '0.25rem',   // 4px
        'tick-md': '0.5rem',    // 8px
        'tick-lg': '0.75rem'    // 12px
      },
      animation: {
        "price-up": "price-up 0.5s ease-in-out",
        "price-down": "price-down 0.5s ease-in-out",
        "volume-pulse": "volume-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        "price-up": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "hsl(var(--profit))" }
        },
        "price-down": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "hsl(var(--loss))" }
        },
        "volume-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")
  ]
}

export default config