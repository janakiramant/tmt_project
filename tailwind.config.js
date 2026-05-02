/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        primary: '#6366f1',
        primaryHover: '#4f46e5',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        danger: '#fb7185',
        success: '#a7f3d0',
        warning: '#fde68a',
        priorityHigh: '#fb7185',
        priorityMedium: '#fde68a',
        priorityLow: '#a7f3d0',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      boxShadow: {
        'bento': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}
