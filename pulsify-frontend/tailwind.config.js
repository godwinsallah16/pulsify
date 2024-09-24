/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      screens: {
        sm: { max: "480px" },
        md: { min: "481px", max: "780px" },
        lg: "781px",
      },
      keyframes: {
        "scroll-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "scroll-right": "scroll-right 5s linear infinite",
      },
    },
  },
  plugins: [],
};
