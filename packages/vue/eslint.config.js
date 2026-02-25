import vueConfig from "@prefabs.tech/eslint-config/vue.js";

export default [
  ...vueConfig,
  {
    rules: {
      "unicorn/no-empty-file": "off",
    },
  },
];
