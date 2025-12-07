/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0F172A", // Dark Slate (Background)
                surface: "#1E293B",    // Slate 800 (Card Surface)
                primary: "#10B981",    // Emerald 500 (Primary/Success)
                secondary: "#0F766E",  // Teal 700 (Secondary)
                accent: "#2DD4BF",     // Teal 400 (Accent)
                text: "#94A3B8",       // Slate 400 (Muted Text)
                white: "#F8FAFC",      // Slate 50 (Heading Text)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
