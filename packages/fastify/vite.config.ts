import { resolve, dirname } from "node:path";
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
        fileName: "prefabs-tech-saas-fastify",
        formats: ["cjs", "es"],
        name: "PrefabsTechSaasFastify",
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
            "@prefabs.tech/fastify-config": "PrefabsTechFastifyConfig",
            "@prefabs.tech/fastify-graphql": "PrefabsTechFastifyGraphql",
            "@prefabs.tech/fastify-mailer": "PrefabsTechFastifyMailer",
            "@prefabs.tech/fastify-s3": "PrefabsTechFastifyS3",
            "@prefabs.tech/fastify-slonik": "PrefabsTechFastifySlonik",
            "@prefabs.tech/fastify-user": "PrefabsTechFastifyUser",
            "@prefabs.tech/postgres-migrations":
              "PrefabsTechPostgresMigrations",
            "@graphql-tools/merge": "graphqlToolsMerge",
            fastify: "Fastify",
            "fastify-plugin": "FastifyPlugin",
            mercurius: "Mercurius",
            "lodash.merge": "LodashMerge",
            graphql: "Graphql",
            "graphql-tag": "graphqlTag",
            humps: "Humps",
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
