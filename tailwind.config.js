/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      custompeach: '#FFE5B4',
      customgreen:'#CDE8B4', // Add your custom color here
      customgray:'#E5DBCA',
   
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('flowbite/plugin')
  ],
  daisyui: {
    themes: ["light"], // Set default theme to "light"
  },
}

