/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // the project already ships its own base styles; keep Tailwind to utilities/components
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#151214', 2: '#4a4247', 3: '#8d8288' },
        ivory: '#fbf8f5',
        warm: '#f7f2f3',
        beige: '#efe4d8',
        blush: { 50: '#fdf6f8', 100: '#fbe7ec', 200: '#f4c4cf', 300: '#eaa9b9', 400: '#e59aac', 500: '#d4849a', 600: '#c47187', 700: '#a95a70' },
        rose: { dust: '#c9a0a6' },
      },
      fontFamily: {
        sans: ['"Inter Tight"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 24px 60px -32px rgba(70, 30, 45, 0.35)',
        card: '0 10px 30px -18px rgba(70, 30, 45, 0.28)',
      },
      borderRadius: { '4xl': '2rem' },
    },
  },
  plugins: [],
}
