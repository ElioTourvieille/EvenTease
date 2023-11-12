/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        '2xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        'xl': '1024px',
        // => @media (min-width: 1024px) { ... }

        'lg': '768px',
        // => @media (min-width: 768px) { ... }

        'md': '640px',
        // => @media (min-width: 640px) { ... }

        'sm': '300px',
        // => @media (min-width: 300px) { ... }
      },
      colors: {
        jet: "#282828",
        smoke: "#F5F5F5",
        platinum: "#D9D9D9",
        phlox: "#E02AFF",
        azure: "#0080FF",
      },
    },
  },

  plugins: [],
}

