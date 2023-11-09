const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    backgroundImage: {
      "gradient-default":
        "linear-gradient(131.09deg,rgba(47, 47, 47, 0.4) 8.8%,rgba(103, 100, 98, 0.11) 88.99%)",
      "gradient-border-bg":
        "linear-gradient(131.93deg,rgba(245, 142, 142, 0.6) 11.72%,rgba(246, 162, 148, 23) 38.41%,rgba(248, 190, 157, 0.23) 66.36%,rgba(249, 212, 164, 0.6) 91.8%)",
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
      none: "none",
      primary: {
        light: "#F49893",
        DEFAULT: "#F58E8E",
      },
      grey: {
        100: "#F7F0ED",
        200: "#F5F5F5",
        300: "#EDEDED",
        400: "#999999",
        500: "#9597A3",
        600: "#4D4D4F",
        700: "#302F32",
        800: "#28292D",
        900: "#1D1E24",
      },
      ok: "#2ED291",
      warning: "#F9B96D",
      danger: "#C91432",
    },
    extend: {
      fontFamily: {
        sans: ["Pretendard", ...defaultTheme.fontFamily.sans],
      },
      minHeight: {
        14: "3.5rem",
      },
    },
  },
};
