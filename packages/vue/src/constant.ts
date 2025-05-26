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
  ACCOUNTS: "/accounts",
  ACCOUNTS_VIEW: "/accounts/:id",
  ACCOUNTS_ADD: "/accounts/new",
  ACCOUNTS_EDIT: "/accounts/:id/edit",

  // app routes
  ACCOUNT_SETTINGS: "/account-settings",
  MY_ACCOUNTS: "/accounts",
};
