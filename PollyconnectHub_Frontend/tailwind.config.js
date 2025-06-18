/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        textgreen: "#56ca23",
        buttongreen: "#57CC99",
        darkgreen: "#327c1c",
        bgwhite: " #f5f5f5",
      },
      zIndex: {
        '-10': '-10',
      }
    },
  },
  // plugins: [require("daisyui")],
  // daisyui: {
  //   themes: ["light", "dark", "cupcake"],
  // },
};
