/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Vite uses these file types commonly
    ],
    theme: {
        extend: {fontFamily: {
                sans: ["Figtree", "sans-serif"], // Add your custom font here
            }},
    },
    plugins: [],
}