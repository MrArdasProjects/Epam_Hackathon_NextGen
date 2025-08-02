/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",             // ← bu satır önemli
    "./src/**/*.{js,ts,jsx,tsx}" // ← tsx desteği için bu gerekli
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

