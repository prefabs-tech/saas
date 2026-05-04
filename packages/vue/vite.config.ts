import vue from "@vitejs/plugin-vue";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

import { dependencies, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: (format) => `PrefabsTechSaasVue.${format}.js`,
        name: "PrefabsTechSaasVue",
      },
      rollupOptions: {
        external: [
          ...Object.keys(peerDependencies),
          ...Object.keys(dependencies),
          /^supertokens-.*/,
        ],
        output: {
          exports: "named",
          globals: {
            "@prefabs.tech/vue3-config": "PrefabsTechVue3Config",
            "@prefabs.tech/vue3-i18n": "PrefabsTechVue3I18n",
            "@prefabs.tech/vue3-layout": "PrefabsTechVue3Layout",
            "@prefabs.tech/vue3-ui": "PrefabsTechVue3UI",
            "@vueuse/core": "VueuseCore",
            axios: "Axios",
            pinia: "Pinia",
            "vee-validate": "Veevalidate",
            vue: "Vue",
            "vue-router": "VueRouter",
            yup: "Yup",
            zod: "Zod",
          },
        },
      },
      target: "esnext",
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@/": new URL("src/", import.meta.url).pathname,
      },
    },
    test: {
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
      },
      environment: "jsdom",
    },
  };
});
