// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ted": {
        target: "https://ted.europa.eu",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ted/, ""),
        configure: (proxy) => {
          (proxy as any).on("proxyRes", (proxyRes: any) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-expose-headers"] = "*";
          });
        },
      },
      "/ft": {
        target: "https://ec.europa.eu",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ft/, ""),
        configure: (proxy) => {
          (proxy as any).on("proxyRes", (proxyRes: any) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-expose-headers"] = "*";
          });
        },
      },
    },
  },
});
