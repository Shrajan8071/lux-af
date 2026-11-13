/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "rgb(var(--luxury-bg) / <alpha-value>)",
          card: "rgb(var(--luxury-card) / <alpha-value>)",
          frame: "rgb(var(--luxury-frame) / <alpha-value>)",
          border: "rgb(var(--luxury-border) / <alpha-value>)",
          borderLight: "rgb(var(--luxury-border-light) / <alpha-value>)",
          text: "rgb(var(--luxury-text) / <alpha-value>)",
          muted: "rgb(var(--luxury-muted) / <alpha-value>)",
          subtle: "rgb(var(--luxury-subtle) / <alpha-value>)",
          accent: "rgb(var(--luxury-accent) / <alpha-value>)",
          accentHover: "rgb(var(--luxury-accent-hover) / <alpha-value>)",
          highlight: "rgb(var(--luxury-highlight) / <alpha-value>)",
          black: "rgb(var(--luxury-black) / <alpha-value>)"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Didot", "Bodoni MT", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      letterSpacing: {
        widestEditorial: "0.2em",
        tighterEditorial: "-0.02em"
      }
    },
  },
  plugins: [],
}
