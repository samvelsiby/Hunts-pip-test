/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulse: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0.1 }
        }
      },
      animation: {
        loadingBar: 'loadingBar 1.5s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
      },
      transitionDelay: {
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
        '700': '700ms',
      }
    },
  },
  plugins: [],
}
