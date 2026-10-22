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
        gym: {
          void: '#050505',
          dark: '#0A0A0A',
          charcoal: '#111111',
          surface: '#151515',
          card: 'rgba(21, 21, 21, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 30, 39, 0.4)',
          red: '#FF1E27',
          crimson: '#E50914',
          darkRed: '#8B0000',
          neonRed: '#FF2A36',
          muted: '#8E8E93',
          light: '#F5F5F7'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
        heading: ['"Oswald"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(255, 30, 39, 0.45)',
        'glow-sm': '0 0 15px rgba(255, 30, 39, 0.3)',
        'glow-box': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #FF1E27 0%, #B80009 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.95) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
