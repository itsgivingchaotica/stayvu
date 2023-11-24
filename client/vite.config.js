import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default ({ mode }) => {
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: mode === "production" ? "https://stayvue-server.up.railway.app" : "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
