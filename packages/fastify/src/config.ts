import { ApiConfig } from "@prefabs.tech/fastify-config";

const getSaasConfig = (config: ApiConfig) => {
  const saasConfig = config.saas;
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  const apps = (
    saasConfig.apps || [
      {
        name: "admin",
        subdomain: "admin",
        domain: undefined,
      },
    ]
  ).map((app) => ({
    ...app,
    domain: app.domain || `${app.subdomain}.${saasConfig.rootDomain}`,
  }));

  return {
    apps: apps,
    excludeRoutePatterns: [
      /^\/$/,
      /^\/auth\//,
      "/me",
      "/invitation/token/",
      ...(saasConfig.excludeRoutePatterns || []),
    ],
    handlers: saasConfig.handlers,
    invalid: {
      domains: saasConfig.invalid?.domains || [],
      slugs: saasConfig.invalid?.domains || ["admin"],
    },
    invitation: saasConfig.invitation,
    mainAppSubdomain: saasConfig.mainAppSubdomain || "app",
    mainApp: {
      subdomain: saasConfig.mainApp?.subdomain || "app",
      domain:
        saasConfig.mainApp?.domain ??
        `${saasConfig.mainApp?.subdomain || "app"}.${saasConfig.rootDomain}`,
    },
    multiDatabase: {
      enabled: saasConfig.multiDatabase?.enabled || false,
      migrations: {
        path:
          saasConfig.multiDatabase?.migrations?.path ||
          `${migrationsPath}/accounts`,
      },
    },
    rootDomain: saasConfig.rootDomain,
    routePrefix: saasConfig.routePrefix,
    routes: saasConfig.routes,
    subdomains: saasConfig.subdomains,
    tables: {
      accounts: {
        name: saasConfig.tables?.accounts?.name || "__accounts",
      },
      accountTypes: {
        name: saasConfig.tables?.accountTypes?.name || "__account_types",
      },
      accountTypesI18n: {
        name:
          saasConfig.tables?.accountTypesI18n?.name || "__account_types_i18n",
      },
      accountUsers: {
        name: saasConfig.tables?.accountUsers?.name || "__account_users",
      },
      accountAddresses: {
        name:
          saasConfig.tables?.accountAddresses?.name || "__account_addresses",
      },
      accountInvitations: {
        name:
          saasConfig.tables?.accountInvitations?.name ||
          "__account_invitations",
      },
    },
  };
};

export default getSaasConfig;
