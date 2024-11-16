/** @type {import('tailwindcss').Config} */
export default {
  plugins: [],
  theme: {
    extend: {
      colors: {
        custom: {
          200: '#dbecae',
          400: '#226149'
        }
      },
      backgroundImage: {
        'leaves-pattern': "url('/src/assets/leaves.png')",
      }
    },
  },
  content: ["./index.html",'./src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
}