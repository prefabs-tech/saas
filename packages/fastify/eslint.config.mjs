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
  {
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
            snakeCase: true,
          },
          ignore: [/__test__/],
        },
      ],
    },
  },
];
