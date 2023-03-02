import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/nord": {
        target: "https://ob.nordigen.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nord/, ""),
      },
    },
    cors: {
      origin: ["https://ob.nordigen.com"],
      methods: ["GET", "PUT", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
});
