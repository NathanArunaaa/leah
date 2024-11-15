/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        main: '#D6E0D9',
        second: '#7A807C'
      },
    },
  },
  plugins: [require('flowbite/plugin')],
 
}
