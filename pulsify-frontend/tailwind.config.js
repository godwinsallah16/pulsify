/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
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
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".nav-style": {
          display: "flex",
          alignItems: "center",
          padding: "0.5rem 1rem", // Added padding
          transition: "background-color 0.3s ease, transform 0.3s ease", // Smooth transition for hover effects
        },
        ".nav-style:hover": {
          backgroundColor: "rgb(75, 85, 99)", // Tailwind's gray-700
          cursor: "pointer",
          transform: "scale(1.1)", // Scale effect on hover
        },
      });
    },
  ],
};
