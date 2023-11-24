import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default ({ mode }) => {
  const isProduction = mode === "production";
  
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // Proxy settings for development
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      // Define a global variable with the API URL
      'process.env.API_URL': JSON.stringify(isProduction ? 'https://stayvue-server.up.railway.app' : 'http://localhost:3001'),
    },
  });
};
