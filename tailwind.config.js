// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coreGradientFrom: '#9333ea', // from-purple-600
        coreGradientVia: '#ec4899',  // via-pink-500
        coreGradientTo: '#facc15',   // to-yellow-400
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      }
    },
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),

  ],
}
