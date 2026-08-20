import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve(import.meta.dirname, "artifacts/mutual-success-partners"),
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "artifacts/mutual-success-partners/src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
});
