const STATUS_OK = "OK";
const API_PATH_REFRESH = "/api/refresh";

export { STATUS_OK, API_PATH_REFRESH };

export const ACCOUNT_HEADER_NAME = "x-account-id";

export const SIGNUP_PATH_DEFAULT = "/auth/signup";

export const SAAS_ACCOUNT_MEMBER = "SAAS_ACCOUNT_MEMBER";
export const SAAS_ACCOUNT_OWNER = "SAAS_ACCOUNT_OWNER";
export const SAAS_ACCOUNT_ROLES_DEFAULT = [
  SAAS_ACCOUNT_OWNER,
  SAAS_ACCOUNT_MEMBER,
];

export const DEFAULT_PATHS = {
  // admin routes
  CUSTOMERS: "/customers",
  CUSTOMERS_VIEW: "/customers/:id",
  CUSTOMERS_ADD: "/customers/new",
  CUSTOMERS_EDIT: "/customers/:id/edit",

  // app routes
  ACCOUNT_SETTINGS: "/account-settings",
  MY_ACCOUNTS: "/accounts",
};
