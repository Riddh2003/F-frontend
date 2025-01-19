/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        metropolis: ["Metropolis", "sans-serif"],
      },
      // backgroundImage: {
      //   'header-image': "url('./assets/img/HeaderImage.png')",
      //   'zomato-logo': "url('./assets/img/ZomatoLogo.png')",
      // }
    },
  },
  plugins: [
    
  ],
  daisyui: {
    themes: [],
  },
};
