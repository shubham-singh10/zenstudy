/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 150, 255, 0.8)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 150, 255, 1)' },
        },
        border: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
        border: "border 3s linear infinite",
      },
    },
  },
  plugins: [],
}


