import type { Config } from "tailwindcss";

export default {
    content: [
        // Rutas corregidas para tu estructura (sin 'src')
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // TUS COLORES DE MARCA (Tequeños Gavidia)
                brand: {
                    blue: '#024ea1',    // Azul
                    cream: '#faefd0',   // Crema
                    yellow: '#fcd991',  // Amarillo
                    red: '#b1173b',     // Rojo
                }
            },
        },
    },
    plugins: [],
} satisfies Config;