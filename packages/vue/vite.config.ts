import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

import { dependencies, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
        fileName: (format) => `12degSaasVue.${format}.js`,
        name: "@12deg/saas-vue",
      },
      rollupOptions: {
        external: [
          ...Object.keys(peerDependencies),
          ...Object.keys(dependencies),
          /supertokens-w+/,
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/vue3-config": "DzangolabVue3Config",
            "@dzangolab/vue3-i18n": "DzangolabVue3I18n",
            "@dzangolab/vue3-layout": "DzangolabVue3Layout",
            "@dzangolab/vue3-ui": "DzangolabVue3UI",
            axios: "Axios",
            pinia: "Pinia",
            vue: "Vue",
            "vue-router": "VueRouter",
            "supertokens-web-js": "SupertokensWebJs",
            "supertokens-web-js/recipe/emailverification":
              "SupertokensWebJsRecipeEmailverification",
            "supertokens-web-js/recipe/session":
              "SupertokensWebJsRecipeSession",
            "supertokens-web-js/recipe/thirdpartyemailpassword":
              "SupertokensWebJsRecipeThirdpartyemailpassword",
            "supertokens-web-js/recipe/userroles":
              "SupertokensWebJsRecipeUserroles",
            "supertokens-website": "SupertokensWebsite",
            "@vueuse/core": "VueuseCore",
            "vee-validate": "Veevalidate",
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
        "@/": new URL("./src/", import.meta.url).pathname,
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
