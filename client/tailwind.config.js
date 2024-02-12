/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        jet: "#282828",
        smoke: "#F5F5F5",
        platinum: "#D9D9D9",
        phlox: "#E02AFF",
        azure: "#0080FF",
      },
      animation: {
        'spin-slow': "spin 8s linear infinite",
      },
    },
    screens: {
      '2xl': {max: '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {max: '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {max: '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {max: '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {max: '639px'},
      // => @media (max-width: 639px) { ... }

      'xs': {max: '375px'},
      // => @media (max-width: 375px) { ... }
    },
  },

  plugins: [],
}

