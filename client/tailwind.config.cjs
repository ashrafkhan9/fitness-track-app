/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#d8ecff',
          200: '#b0d7ff',
          300: '#78b8ff',
          400: '#4097ff',
          500: '#0b78ff',
          600: '#005bdd',
          700: '#0046aa',
          800: '#003579',
          900: '#002550',
        },
      },
    },
  },
  plugins: [],
};

