import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // Suppress noisy ECONNREFUSED logs when backend server isn't running
        configure: (proxy) => {
          proxy.on("error", (err, _req, _res) => {
            // Silently handled by frontend fallback
          });
        },
      },
    },
  },
});
