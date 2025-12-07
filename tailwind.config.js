/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3c7',
          400: '#f59e0b',
          500: '#eab308',
          600: '#ca8a04',
        },
        secondary: {
          300: '#06b6d4',
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        accent: {
          500: '#a855f7',
          600: '#9333ea',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        tech: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
