import { createRequire } from "module";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const require = createRequire(import.meta.url);

function loadNetwork() {
  try {
    return require("../eo-backend/config/network.config.js");
  } catch {
    return {
      lanHost: "localhost",
      backendPort: 3000,
      frontendPort: 5173,
    };
  }
}

const network = loadNetwork();

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const fallbackOrigin = `http://${network.lanHost}:${network.backendPort}`;
  const configuredOrigin = env.VITE_API_ORIGIN || process.env.VITE_API_ORIGIN || "";
  const configuredUrl = env.VITE_API_URL || process.env.VITE_API_URL || "";
  const placeholder = /your-domain\.com/i;
  const apiOrigin =
    configuredOrigin && !placeholder.test(configuredOrigin) ? configuredOrigin : fallbackOrigin;
  // In `npm run dev`, talk to the Vite `/api` proxy (same origin) so cookies work.
  const apiUrl =
    configuredUrl && !placeholder.test(configuredUrl)
      ? configuredUrl
      : mode === "development"
        ? "/api"
        : `${apiOrigin}/api`;

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
      "import.meta.env.VITE_API_ORIGIN": JSON.stringify(apiOrigin),
      "import.meta.env.VITE_APP_ENV": JSON.stringify(mode),
    },
    server: {
      host: true,
      port: network.frontendPort,
      proxy: {
        "/api": {
          target: `http://localhost:${network.backendPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
