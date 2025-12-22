/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        raw: {
          DEFAULT: '#8B7355',
          light: '#A89078',
          dark: '#6B5A45',
        },
        intermediate: {
          DEFAULT: '#4A90E2',
          light: '#6BA3E8',
          dark: '#357ABD',
        },
        finished: {
          DEFAULT: '#50C878',
          light: '#6FD48F',
          dark: '#3FA864',
        },
      },
      animation: {
        'flow': 'flow 2s linear infinite',
        'process': 'process 1s ease-in-out infinite',
      },
      keyframes: {
        flow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        process: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
