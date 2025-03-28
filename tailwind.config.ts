import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config = {
  mode: "jit",
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        // General colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Theme colors
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

        // Custom colors
        "app-background": "#0a101f",
        "app-border": "#1e2d3d",
        "app-cyan": "#0ff",
        "app-green": "#00ff99",
        "app-red": "#ff0000",
        "loan-home-bg": "#1e3a57",
        "loan-personal-bg": "#2d1e57",
        "loan-education-bg": "#1e5741",
        "loan-business-bg": "#573e1e",
        "loan-auto-bg": "#3a1e57",
        "status-ontime-bg": "#003b29",
        "status-late-bg": "#3b0000",

        // Second config additions
        darkbg: "#18191A",
        darkborder: "#232323",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "row-fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        pulse: {
          "0%": { opacity: "0.6" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-50": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "row-fade-in": "row-fade-in 0.5s ease-out",
        pulse: "pulse 1.5s infinite",
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "gradient-x": "gradient-x 3s ease infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities, addBase, theme }) => {
      addBase({
        ":root": {
          "--background": "222.2 84% 4.9%",
          "--foreground": "210 40% 98%",
          "--card": "222.2 84% 4.9%",
          "--card-foreground": "210 40% 98%",
          "--popover": "222.2 84% 4.9%",
          "--popover-foreground": "210 40% 98%",
          "--primary": "180 100% 50%",
          "--primary-foreground": "222.2 47.4% 11.2%",
          "--secondary": "217.2 32.6% 17.5%",
          "--secondary-foreground": "210 40% 98%",
          "--muted": "217.2 32.6% 17.5%",
          "--muted-foreground": "215 20.2% 65.1%",
          "--accent": "217.2 32.6% 17.5%",
          "--accent-foreground": "210 40% 98%",
          "--destructive": "0 62.8% 30.6%",
          "--destructive-foreground": "210 40% 98%",
          "--border": "217.2 32.6% 17.5%",
          "--input": "217.2 32.6% 17.5%",
          "--ring": "212.7 26.8% 83.9%",
          "--radius": "0.5rem",
        },
        body: {
          backgroundColor: theme("colors.app-background"),
          color: theme("colors.white"),
        },
      });

      addUtilities({
        ".animate-in": {
          "animation-fill-mode": "forwards",
        },
        ".animate-delay-100": {
          "animation-delay": "100ms",
        },
        ".animate-delay-200": {
          "animation-delay": "200ms",
        },
        ".animate-delay-300": {
          "animation-delay": "300ms",
        },
        ".animate-delay-400": {
          "animation-delay": "400ms",
        },
        ".animate-delay-500": {
          "animation-delay": "500ms",
        },
        ".table": {
          "background-color": "transparent",
        },
        ".table th": {
          color: theme("colors.app-cyan"),
          "background-color": "transparent",
        },
        ".table td": {
          color: theme("colors.white"),
          "background-color": "transparent",
        },
        ".table tr": {
          "background-color": "transparent",
        },
        ".table tr:hover": {
          "background-color": theme("colors.app-border"),
        },
        ".bg-card, .bg-background, .bg-popover": {
          "background-color": `${theme("colors.app-background")} !important`,
        },
        ".dropdown-menu": {
          "background-color": theme("colors.app-background"),
          "border-color": theme("colors.app-border"),
        },
        ".dropdown-menu-content": {
          "z-index": "50",
          position: "absolute",
          top: "100%",
          right: "0",
          "margin-top": "5px",
          "background-color": theme("colors.app-background"),
          border: `1px solid ${theme("colors.app-border")}`,
          "border-radius": "6px",
          overflow: "hidden",
          width: "160px",
          animation: "fadeIn 0.2s ease-out forwards",
        },
        ".button": {
          "background-color": theme("colors.app-background"),
          "border-color": theme("colors.app-border"),
        },
        ".backdrop-blur-sm": {
          "backdrop-filter": "blur(4px)",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
