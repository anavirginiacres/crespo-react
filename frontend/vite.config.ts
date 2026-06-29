import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        // Puerto 8081: evita conflicto con Jenkins u otros servicios en 8080
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
      },
    },
  },
});
