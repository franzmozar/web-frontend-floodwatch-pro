/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#667eea",
          DEFAULT: "#5a67d8",
          dark: "#4c51bf",
        },
        brand: {
          blue: "#38b6ff",
          indigo: "#5271ff",
        },
      },
      fontFamily: {
        abril: ["Abril Fatface", "serif"],
      },
    },
  },
  plugins: [],
};
