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
  INVITATION_ACCEPT: "/invitation/token/:token",
  INVITATION_JOIN: "/join/token/:token",
  INVITATION_SIGNUP: "/signup/token/:token",
  MY_ACCOUNTS: "/accounts",
  SIGNUP: "/signup",
};

export const DEFAULT_ROUTES_CONFIG_ADMIN = {
  accountsAdd: { disabled: false, path: DEFAULT_PATHS.ACCOUNTS_ADD },
  accountsEdit: { disabled: false, path: DEFAULT_PATHS.ACCOUNTS_EDIT },
  accountsView: { disabled: false, path: DEFAULT_PATHS.ACCOUNTS_EDIT },
};

export const DEFAULT_ROUTES_CONFIG_APP = {
  accountSettings: { disabled: false, path: DEFAULT_PATHS.ACCOUNT_SETTINGS },
  invitationAccept: { disabled: false, path: DEFAULT_PATHS.INVITATION_ACCEPT },
  invitationJoin: { disabled: false, path: DEFAULT_PATHS.INVITATION_JOIN },
  invitationSignup: { disabled: false, path: DEFAULT_PATHS.INVITATION_SIGNUP },
  myAccounts: { disabled: false, path: DEFAULT_PATHS.MY_ACCOUNTS },
  signup: { disabled: false, path: DEFAULT_PATHS.SIGNUP },
};
