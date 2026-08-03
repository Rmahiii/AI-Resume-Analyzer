/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "rgb(var(--color-bg-rgb) / <alpha-value>)",
        "app-nav": "rgb(var(--color-nav-rgb) / <alpha-value>)",
        "app-card": "rgb(var(--color-card-rgb) / <alpha-value>)",
        "app-primary": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "app-secondary": "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        "app-text": "rgb(var(--color-text-primary-rgb) / <alpha-value>)",
        "app-muted": "rgb(var(--color-text-secondary-rgb) / <alpha-value>)",
        "app-success": "rgb(var(--color-success-rgb) / <alpha-value>)",
        "app-warning": "rgb(var(--color-warning-rgb) / <alpha-value>)",
        "app-error": "rgb(var(--color-error-rgb) / <alpha-value>)"
      },
      boxShadow: {
        panel: "none"
      }
    }
  },
  plugins: []
};
