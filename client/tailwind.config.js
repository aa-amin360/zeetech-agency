/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF9F5",
          100: "#F5F3EB",
          200: "#EBE7DC",
          DEFAULT: "#F9F8F3",
        },
        brand: {
          orange: "#FF5400",
          orangeHover: "#E04800",
          dark: "#0D0D0D",
          muted: "#666666",
          border: "rgba(0, 0, 0, 0.08)",
        },
        card: {
          orange: "#FB923C",
          lime: "#A3E635",
          cyan: "#38BDF8",
          purple: "#C084FC",
          pink: "#F472B6",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        editorial: ["Instrument Serif", "Playfair Display", "serif"],
        script: ["Instrument Serif", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        widest: "0.15em",
      },
    },
  },
  plugins: [],
};
