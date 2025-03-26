export const ACCOUNT_HEADER_NAME = "x-account-id";

export const SIGNUP_PATH_DEFAULT = "/auth/signup";

export const SAAS_ACCOUNT_MEMBER = "SAAS_ACCOUNT_MEMBER";
export const SAAS_ACCOUNT_OWNER = "SAAS_ACCOUNT_OWNER";
export const SAAS_ACCOUNT_ROLES_DEFAULT = [
  SAAS_ACCOUNT_OWNER,
  SAAS_ACCOUNT_MEMBER,
];

export const DEFAULT_PATHS = {
  // admin protected routes
  ACCOUNTS: "/accounts",
  ACCOUNTS_VIEW: "/accounts/:id",
  ACCOUNTS_ADD: "/accounts/new",
  ACCOUNTS_EDIT: "/accounts/:id/edit",

  // app protected routes
  MY_ACCOUNTS: "/accounts",
  MY_ACCOUNT: "/my-account",
  // JOIN_ACCOUNT :'/join/token/:token', // TODO

  // app public routes
  ACCEPT_INVITATION: "/signup/token/:token",
};
