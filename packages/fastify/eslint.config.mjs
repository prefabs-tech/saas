import fastifyConfig from "@prefabs.tech/eslint-config/fastify.js";

export default [
  ...fastifyConfig,
  {
    ignores: [
      "build",
      "coverage",
      "node_modules",
      "fastify.d.ts",
      "jest.config.cjs",
    ],
  },
];
