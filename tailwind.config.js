/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'firebase-blue': '#4285F4', // Color típico de Firebase
        'firebase-yellow': '#FFCA28',
      },
    },
  },
  plugins: [],
}