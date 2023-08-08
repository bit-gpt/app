/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        maxSm: { max: "639px" },
        maxMd: { max: "767px" },
        maxLg: { max: "1023px" },
        minMaxMd: { min: "768px", max: "1023px" },
      },
      backgroundImage: {
        "gradient-default":
          "linear-gradient(131.09deg,rgba(47, 47, 47, 0.4) 8.8%,rgba(103, 100, 98, 0.11) 88.99%)",
        "gradient-border-bg":
          "linear-gradient(131.93deg,rgba(245, 142, 142, 0.6) 11.72%,rgba(246, 162, 148, 23) 38.41%,rgba(248, 190, 157, 0.23) 66.36%,rgba(249, 212, 164, 0.6) 91.8%)",
      },
      boxShadow: {
        default: "box-shadow(0px 4.49864px 26.9918px -1.12466px rgba(0, 0, 0, 0.2))",
      },
      colors: {
        darkjunglegreen: "#1D1E24",
        brightgray: "#EDEDED",
        americanpink: "#F49893",
        tulip: "#F58E8E",
        lightsalmonpink: "#F49E97",
        darkliver: "#4D4D4F",
        manatee: "#9597A3",
        cultured: "#F5F5F5",
        Onyx: "#383838",
        timberwolf: "#DBD5D5",
        sonicsilver: "#797979",
        antiflashwhite: "#F1F2F4",
        lavendergray: "#C5C5D2",
        darkcharcoal: "#302F32",
        philippinegray: "#8F8F95",
        ghostwhite: "#F7F7FD",
        ruddypink: "#EA938E",
        isabelline: "#F7F0ED",
        arsenic: "#3C3D49",
        darkgunmetal: "#20232B",
        spanishgray: "#999999",
        charlestongreen: "#29292D",
      },
    },
  },
  plugins: [],
};
