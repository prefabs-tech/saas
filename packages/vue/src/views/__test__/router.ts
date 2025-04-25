import { createRouter, createWebHistory } from "vue-router";

import Accounts from "../accounts/Index.vue";

const Test = {
  name: "Test",
  template: `<h1>Test</h1>`,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: Accounts,
      name: "accounts",
      path: "/accounts",
    },
    {
      component: Test,
      path: "/",
    },
  ],
});

export default router;
