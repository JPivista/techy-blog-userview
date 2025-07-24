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
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      }
    },
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
}
