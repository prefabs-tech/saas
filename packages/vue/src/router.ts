import { Router } from "vue-router";
import { DEFAULT_PATHS } from "./constant";
import type { RouteMeta, RouteRecordRaw } from "vue-router";

// Import components
import Customers from "./views/Customers/Index.vue";
import CustomerAdd from "./views/Customers/Add.vue";
import CustomerEdit from "./views/Customers/Edit.vue";
import CustomerView from "./views/Customers/View.vue";

const _routes = {
  customers: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: Customers,
    name: "customers",
    path: DEFAULT_PATHS.CUSTOMERS,
  } as RouteRecordRaw,

  customersAdd: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: CustomerAdd,
    name: "customersAdd",
    path: DEFAULT_PATHS.CUSTOMERS_ADD,
  } as RouteRecordRaw,

  customersEdit: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: CustomerEdit,
    name: "customersEdit",
    path: DEFAULT_PATHS.CUSTOMERS_EDIT,
  } as RouteRecordRaw,

  customersView: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: CustomerView,
    name: "customersView",
    path: DEFAULT_PATHS.CUSTOMERS_VIEW,
  } as RouteRecordRaw,
};

const addRoutes = (router: Router) => {
  router.addRoute(_routes.customers);
  router.addRoute(_routes.customersAdd);
  router.addRoute(_routes.customersEdit);
  router.addRoute(_routes.customersView);
};

const updateRouter = (router: Router) => {
  addRoutes(router);
};

export default updateRouter;
