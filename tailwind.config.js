/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        xtra: {
          primary: '#f59e0b',    // Primary Golden Amber
          navy: '#0c1933',       // Dark Navy Background
          teal: '#20c997',       // Accent Teal
          dark: '#222222',       // Top Bar / Dark Grey
          light: '#f8f9fa',      // Section Backgrounds
          white: '#ffffff',
          textHover: '#d97706',  // Amber Hover
          border: '#eaedf2'
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'corporate': '0 5px 20px rgba(0, 0, 0, 0.05)',
        'corporateHover': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
        'fade-in': 'fadeIn 1s ease-out both',
        'fade-in-up-delay-1': 'fadeInUp 0.8s ease-out 0.2s both',
        'fade-in-up-delay-2': 'fadeInUp 0.8s ease-out 0.4s both',
        'fade-in-up-delay-3': 'fadeInUp 0.8s ease-out 0.6s both',
      }
    },
  },
  plugins: [],
}
