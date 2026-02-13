import reactConfig from "@prefabs.tech/eslint-config/react-app.js";

export default [
  { ignores: ["coverage", "dist", "node_modules"] },
  ...reactConfig,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
