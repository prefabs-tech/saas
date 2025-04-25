import { createRouter, createWebHistory } from "vue-router";

import Login from "../Login.vue";

const Test = {
  name: "Test",
  template: `<h1>Test</h1>`,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: Login,
      name: "login",
      path: "/login",
    },
    {
      component: Test,
      path: "/",
    },
  ],
});

export default router;
