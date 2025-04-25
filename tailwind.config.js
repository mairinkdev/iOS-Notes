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
        'ios-background': {
          light: '#F2F2F7',
          dark: '#1C1C1E'
        },
        'ios-note': {
          light: '#FFFFFF',
          dark: '#2C2C2E'
        },
        'ios-text': {
          light: '#000000',
          dark: '#FFFFFF'
        },
        'ios-secondary': {
          light: '#8E8E93',
          dark: '#8E8E93'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
} 