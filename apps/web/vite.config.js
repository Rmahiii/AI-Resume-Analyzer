import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          motion: ["framer-motion"],
          vendor: ["react", "react-dom", "react-router-dom", "@reduxjs/toolkit", "react-redux"]
        }
      }
    }
  }
});
