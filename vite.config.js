import { createRequire } from "module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Single source of truth: eo-backend/config/network.config.js
const require = createRequire(import.meta.url);
const network = require("../eo-backend/config/network.config.js");

const apiOrigin = `http://${network.lanHost}:${network.backendPort}`;
const apiUrl = `${apiOrigin}/api`;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
    "import.meta.env.VITE_API_ORIGIN": JSON.stringify(apiOrigin),
  },
  server: {
    host: true, // 0.0.0.0 — open via http://<lanHost>:5173
    port: network.frontendPort,
    proxy: {
      "/api": {
        target: `http://localhost:${network.backendPort}`,
        changeOrigin: true,
      },
    },
  },
});
