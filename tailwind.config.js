/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkjunglegreen: "#1D1E24",
        brightgray:"#EDEDED",
        americanpink: "#F49893",
        tulip: "#F58E8E",
      }
    },
  },
  plugins: [],
}
