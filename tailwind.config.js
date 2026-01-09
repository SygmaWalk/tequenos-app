/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Si llegaras a mover cosas a src en el futuro, esto lo cubre:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TUS COLORES DE MARCA
        brand: {
          blue: '#024ea1',    // Azul Tequeños Gavidia
          cream: '#faefd0',   // Crema Fondo
          yellow: '#fcae1b',  // Amarillo degradado
          red: '#b1173b',     // Rojo CTA
        }
      },
    },
  },
  plugins: [],
}