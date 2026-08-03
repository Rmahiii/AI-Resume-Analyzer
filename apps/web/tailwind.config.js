/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--color-bg)",
          nav: "var(--color-nav)",
          card: "var(--color-card)",
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          text: "var(--color-text-primary)",
          muted: "var(--color-text-secondary)",
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)"
        }
      },
      boxShadow: {
        panel: "none"
      }
    }
  },
  plugins: []
};
