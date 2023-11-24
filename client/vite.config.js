import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default ({ mode }) => {
  const isProduction = mode === "production";

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: isProduction ? process.env.API_URL : "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      'process.env.API_URL': JSON.stringify(isProduction ? process.env.API_URL : 'http://localhost:3001'),
    },
  });
};
