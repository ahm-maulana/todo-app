/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Josefin Sans', 'Sans-serif']
    },
    extend: {
      screens: {
        'sm': '376px'
      }
    },
  },
  plugins: [],
}
