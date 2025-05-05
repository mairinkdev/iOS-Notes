/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        'ios-yellow': '#FFCC00',
        'ios-blue': '#3478F6',
        'ios-red': '#FF2D55',
        'ios-green': '#4CD964',
        'ios-purple': '#5856D6',
        'ios-orange': '#FF9500',
        'ios-pink': '#FF2D55',
        'ios-teal': '#64D2FF',
        'ios-background': {
          light: 'var(--ios-background-light)',
          dark: 'var(--ios-background-dark)'
        },
        'ios-note': {
          light: 'var(--ios-note-light)',
          dark: 'var(--ios-note-dark)'
        },
        'ios-text': {
          light: 'var(--ios-text-light)',
          dark: 'var(--ios-text-dark)'
        },
        'ios-secondary': {
          light: 'var(--ios-secondary-light)',
          dark: 'var(--ios-secondary-dark)'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'ios-dark': '0 2px 10px rgba(0, 0, 0, 0.2)',
        'ios-button': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'ios-card': '0 4px 10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'ios': '10px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        'ios': '10px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
