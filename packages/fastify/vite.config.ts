import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";

import { dependencies, peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    build: {
      lib: {
        entry: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "src/index.ts",
        ),
        fileName: "12deg-saas-fastify",
        name: "12degSaasFastify",
      },
      rollupOptions: {
        external: [
          ...Object.keys(dependencies),
          ...Object.keys(peerDependencies),
          "node:fs",
          /supertokens-node+/,
        ],
        output: {
          exports: "named",
          globals: {
            "@dzangolab/fastify-config": "DzangolabFastifyConfig",
            "@dzangolab/fastify-graphql": "DzangolabFastifyGraphql",
            "@dzangolab/fastify-slonik": "DzangolabFastifySlonik",
            "@dzangolab/fastify-user": "DzangolabFastifyUser",
            "@dzangolab/postgres-migrations": "DzangolabPostgresMigrations",
            "@graphql-tools/merge": "graphqlToolsMerge",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            mercurius: "Mercurius",
            "lodash.merge": "LodashMerge",
            graphql: "Graphql",
            "graphql-tag": "graphqlTag",
            "node:fs": "NodeFs",
            nanoid: "NanoId",
            pg: "Pg",
            slonik: "Slonik",
            "supertokens-node": "SupertokensNode",
            "supertokens-node/framework/fastify": "SupertokensFastify",
            "supertokens-node/lib/build/framework/fastify/framework":
              "SupertokensFramework",
            "supertokens-node/lib/build/recipe/session/claims": "claims",
            "supertokens-node/lib/build/recipe/session/recipe": "SessionRecipe",
            "supertokens-node/recipe/emailverification": "EmailVerification",
            "supertokens-node/recipe/session/framework/fastify":
              "SupertokensSessionFastify",
            "supertokens-node/recipe/session": "SupertokensSession",
            "supertokens-node/recipe/thirdpartyemailpassword":
              "SupertokensThirdPartyEmailPassword",
            "supertokens-node/recipe/userroles": "SupertokensUserRoles",
            zod: "zod",
          },
        },
      },
      target: "es2022",
    },
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
    },
  };
});
