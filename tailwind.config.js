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
        // Foreground-driven so every text/bg/ring-white utility flips with the theme.
        white: "rgb(var(--fg) / <alpha-value>)",
        // Text that always sits on a honey surface, so it must stay dark in both themes.
        onhoney: "rgb(var(--on-honey) / <alpha-value>)",
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        "honey-sm": "0 10px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(255, 197, 61, 0.10)",
        "honey-md": "0 18px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255, 197, 61, 0.14)",
        card: "var(--card-shadow)",
        menu: "var(--menu-shadow)",
      },
      backgroundImage: {
        "mesh-ink": "var(--mesh-ink)",
      },
    },
  },
  plugins: [],
};
