import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default ({ mode }) => {
  const isProduction = mode === "production";
  const apiUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

  console.log("API_URL:", apiUrl);

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
