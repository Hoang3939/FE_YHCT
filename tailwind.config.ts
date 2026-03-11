import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#00d492",
          600: "#008b74",
          700: "#021b13",
          800: "#01422d",
        },
        text: {
          muted: "#898c85",
          base: "#fbf7ef",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
        geist: ["Geist", "sans-serif"],
      },
      boxShadow: {
        card: "2px 2px 15px rgba(105, 255, 185, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
