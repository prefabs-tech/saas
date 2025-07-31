import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: (format) => `12degSaasReact.${format}.js`,
        name: "12degSaasReact",
      },
      rollupOptions: {
        external: [...Object.keys(peerDependencies)],
        output: {
          exports: "named",
          globals: {
            "@prefabs.tech/react-config": "DzangolabReactConfig",
            "@prefabs.tech/react-form": "DzangolabReactForm",
            "@prefabs.tech/react-i18n": "DzangolabReactI18n",
            "@prefabs.tech/react-ui": "DzangolabReactUi",
            react: "React",
            "react-dom": "ReactDom",
            "react-router-dom": "ReactRouterDom",
            "supertokens-web-js": "SuperTokensWebJs",
          },
        },
      },
      target: "esnext",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@/": new URL("./src/", import.meta.url).pathname,
      },
    },
    server: {
      port: Number(process.env.VITE_APP_PORT) || 8889,
    },
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
  };
});
