/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  darkMode: 'class',
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
      ringColor: ['dark'],
      ringOffsetColor: ['dark'],
      ringOffsetWidth: ['dark'],
      ringOpacity: ['dark'],
      ringWidth: ['dark'],
      boxShadow: ['dark'],
      opacity: ['dark'],
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css"
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
      },
      animationDelay: {
        2000: "2s",
        4000: "4s",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addVariant }) {
      addVariant('peer-placeholder-shown', '.peer:placeholder-shown ~ &');
    },
  ],
  important: true,
  corePlugins: {
    preflight: true,
  }
}
