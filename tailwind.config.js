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
        lightsalmonpink: "#F49E97",
        darkliver: "#4D4D4F",
        manatee: "#9597A3",
        cultured: "#F5F5F5",
        Onyx: "#383838",
        timberwolf: "DBD5D5",
      }
    },
  },
  plugins: [],
}
