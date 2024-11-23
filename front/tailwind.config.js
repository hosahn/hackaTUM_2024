/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
      require('daisyui')
  ],
  daisyui: {
    themes: ["dark", {custom: {

            "primary": "#607dcb",

            "secondary": "#f3f3f3",

            "accent": "#00ed00",

            "neutral": "#f3f3f3",

            "base-100": "#23252c",

            "info": "#00daff",

            "success": "#32af2a",

            "warning": "#fea600",

            "error": "#cf3f48",
        },}]
  }
}