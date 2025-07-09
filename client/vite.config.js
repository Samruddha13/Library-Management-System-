import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),

    // 🔍 Handle source map requests
    {
      name: "handle-source-map-requests",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.endsWith(".map")) {
            req.url = req.url.split("?")[0];
          }
          next();
        });
      },
    },

    // 🌐 Add CORS headers
    {
      name: "add-cors-headers",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, PATCH, OPTIONS"
          );
          res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Requested-With"
          );

          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            return res.end();
          }

          next();
        });
      },
    },
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  clearScreen: false,

  server: {
    host: true,
    port: 3000,
    hmr: {
      overlay: false,
    },
    allowedHosts: "all",
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  css: {
    devSourcemap: true,
  },

  esbuild: {
    sourcemap: true,
  },
});
