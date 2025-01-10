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
    excludeRoutePatterns: saasConfig.excludeRoutePatterns || [/^\/auth\//],
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
          `${migrationsPath}/customers`,
      },
    },
    rootDomain: saasConfig.rootDomain,
    routePrefix: saasConfig.routePrefix,
    routes: saasConfig.routes,
    subdomains: saasConfig.subdomains,
    tables: {
      customers: {
        name: saasConfig.tables?.customers?.name || "__customers",
      },
      customerUsers: {
        name: saasConfig.tables?.customerUsers?.name || "__customer_users",
      },
      customerAddresses: {
        name:
          saasConfig.tables?.customerAddresses?.name || "__customer_addresses",
      },
    },
  };
};

export default getSaasConfig;
