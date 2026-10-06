/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0D0D0D",
        surface: "#141414",
        surface2: "#1B1B1B",
        border: "#FFFFFF1A",
        volt: "#D7FF3B",
        alert: "#FF5A36",
        ember: "#FF4B22",
        emberDark: "#C2280B",
        emberLight: "#FF7A47",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset",
      },
      keyframes: {
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "rise-in": {
          from: { opacity: 0, transform: "translateY(18px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "drawer-in": "drawer-in 0.32s cubic-bezier(0.16,1,0.3,1)",
        "fade-in": "fade-in 0.2s ease-out",
        "rise-in": "rise-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
