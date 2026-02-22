/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d5d1',
          300: '#f4b5ae',
          400: '#ec8a80',
          500: '#e05f52',
          600: '#cc4235',
          700: '#ab352a',
          800: '#8e2f26',
          900: '#772c25',
          950: '#40130f',
        },
      },
    },
  },
  plugins: [],
};
