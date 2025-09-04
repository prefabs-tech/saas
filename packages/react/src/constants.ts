export const ACCOUNT_HEADER_NAME = "x-account-id";

export const ADMIN_SUBDOMAIN_DFAULT = "admin";

export const CONFIG_UI_DEFAULT = {
  account: {
    form: {
      actionsAlignment: "right" as const,
      actionsReverse: false,
    },
  },
  invitation: {
    form: {
      actionsAlignment: "fill" as const,
      actionsReverse: true,
    },
  },
  signup: {
    form: {
      actionsAlignment: "fill" as const,
      actionsReverse: true,
    },
  },
};

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
  INVITATION_ACCEPT: "/invitation/token/:token",
  INVITATION_JOIN: "/join/token/:token",
  INVITATION_SIGNUP: "/signup/token/:token",
  MY_ACCOUNTS: "/accounts",
  SIGNUP: "/signup",
};
