/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#6366f1",   // Indigo-500
        accent: "#14b8a6",  // Teal-500
      },
    },
  },
  plugins: [],
}
