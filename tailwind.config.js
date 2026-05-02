/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        border: '#2a2a2a',
        primary: '#4f46e5',
        primaryHover: '#4338ca',
        textPrimary: '#f3f4f6',
        textSecondary: '#9ca3af',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        priorityHigh: '#ef4444',
        priorityMedium: '#f59e0b',
        priorityLow: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
