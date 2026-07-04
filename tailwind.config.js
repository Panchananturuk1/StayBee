/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        honey: "rgb(var(--honey) / <alpha-value>)",
        slatey: "rgb(var(--slatey) / <alpha-value>)",
        glow: "rgb(var(--glow) / <alpha-value>)",
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        "honey-sm": "0 10px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(255, 197, 61, 0.10)",
        "honey-md": "0 18px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255, 197, 61, 0.14)",
      },
      backgroundImage: {
        "mesh-ink":
          "radial-gradient(1200px 700px at 20% -10%, rgba(255, 197, 61, 0.22), transparent 60%), radial-gradient(900px 600px at 110% 10%, rgba(120, 119, 198, 0.22), transparent 55%), radial-gradient(900px 800px at 40% 120%, rgba(32, 178, 170, 0.14), transparent 60%)",
      },
    },
  },
  plugins: [],
};
