/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  
  ],
  theme: {
     blue: colors.blue,
     yellow: colors.amber,
  
  },
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',

}
