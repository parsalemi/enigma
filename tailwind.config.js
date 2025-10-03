/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        basic: {
          100: 'var(--basic-100)',
          200: 'var(--basic-200)',
          300: 'var(--basic-300)',
          400: 'var(--basic-400)',
          500: 'var(--basic-500)',
          600: 'var(--basic-600)',
          700: 'var(--basic-700)',
          800: 'var(--basic-800)',
          900: 'var(--basic-900)',
          1000: 'var(--basic-1000)',
          1100: 'var(--basic-1100)',
        },
        primary: {
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        error: {
          100: 'var(--error-100)',
          200: 'var(--error-200)',
          300: 'var(--error-300)',
          400: 'var(--error-400)',
          500: 'var(--error-500)',
          600: 'var(--error-600)',
        }
      }
    },
  },
  plugins: [],
}

