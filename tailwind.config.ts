import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0E14", // Deep dark blue/black
        foreground: "#E2E8F0", // Slate 200 light gray text
        card: "#131823",      // Slightly lighter dark for cards
        primary: {
          DEFAULT: "#FF3366", // Vibrant Neon Pink/Red for accents (matches Gamming Bazaar)
          hover: "#E62E5C",
        },
        secondary: {
          DEFAULT: "#2DD4BF", // Teal/Cyan contrast
        },
        dark: {
          100: "#1E293B",
          200: "#131823",
          300: "#0B0E14",
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px -2px rgba(255, 51, 102, 0.4)' },
          'to': { boxShadow: '0 0 20px 2px rgba(255, 51, 102, 0.8)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
