/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        navbar: "#1E293B", // example custom color for navbar background
        accent: "#FBBF24"  // example accent color (you can change this)
      }
    }
  },
  plugins: []
}
