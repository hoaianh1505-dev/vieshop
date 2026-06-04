/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff4ef',
          100: '#ffe4d7',
          500: '#ee4d2d',
          600: '#dd3f20',
          700: '#b93117',
        },
        accent: '#ff7337',
        slate: {
          850: '#18212f',
        },
      },
      boxShadow: {
        panel: '0 18px 38px rgba(15, 23, 42, 0.08)',
        soft: '0 10px 24px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(238,77,45,0.15), transparent 35%), radial-gradient(circle at bottom right, rgba(255,115,55,0.18), transparent 30%)',
        grid: 'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
