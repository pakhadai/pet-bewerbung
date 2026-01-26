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
        mint: "#e0f2f1",
        peach: "#fff3e0",
        lavender: "#f3e5f5",
        primary: "#b39ddb",
        "primary-dark": "#9575cd",
        "accent-pink": "#f8bbd0",
        "text-main": "#4a4a4a",
        "text-secondary": "#6a6a6a",
        "trust-green": "#c8e6c9",
        // Dark mode specific palette
        "dark-bg": "#111827",
        "dark-text-main": "#f3f4f6",
        "dark-text-secondary": "#9ca3af",
      },
      fontFamily: {
        "display": ["Amatic SC", "cursive"],
        "sans": ["Quicksand", "sans-serif"]
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
