/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9eeff",
          200: "#bce2ff",
          300: "#8fd0ff",
          400: "#5ab6f8",
          500: "#2d9de8",
          600: "#167fc8",
          700: "#1466a2",
          800: "#165786",
          900: "#18496f"
        },
        accent: {
          50: "#fff6e8",
          100: "#ffe8bf",
          200: "#ffd58a",
          300: "#ffc058",
          400: "#ffac2d",
          500: "#f79009",
          600: "#d26c00",
          700: "#aa5002",
          800: "#8a3f09",
          900: "#70350d"
        }
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"]
      },
      boxShadow: {
        soft: "0 8px 30px rgba(16, 24, 40, 0.08)"
      }
    },
  },
  plugins: [],
};
