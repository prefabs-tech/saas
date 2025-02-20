import { ApiConfig } from "@dzangolab/fastify-config";

const getSaasConfig = (config: ApiConfig) => {
  const saasConfig = config.saas;
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  return {
    apps: saasConfig.apps || [
      {
        name: "admin",
        subdomain: "admin",
      },
    ],
    excludeRoutePatterns: [
      /^\/auth\//,
      "/me",
      ...(saasConfig.excludeRoutePatterns || []),
    ],
    handlers: saasConfig.handlers,
    invalid: {
      domains: saasConfig.invalid?.domains || [],
      slugs: saasConfig.invalid?.domains || ["admin"],
    },
    mainAppSubdomain: saasConfig.mainAppSubdomain || "app",
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
