/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main_bg_color": "#0D1117",
        "column_bg_color": "#161C22"
      }
    },
  },
  plugins: [],
}
