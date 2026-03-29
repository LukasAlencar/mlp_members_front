/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'card-bg': "url('../assets/bg-carteirinha.png')",
        'do-bg': "url('../assets/bg-do-bg.png')",
      }
    }
  },
  plugins: [],
}
