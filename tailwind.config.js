const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.trueGray,
      amber: colors.amber,
      red: colors.rose,
      green: colors.emerald,
      blue: colors.indigo,
      white: colors.white,
      purple: colors.violet,
    },
    extend: {
      textDecoration: ['focus-visible'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
