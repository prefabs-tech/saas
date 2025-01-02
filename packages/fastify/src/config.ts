import { ApiConfig } from "@dzangolab/fastify-config";

const getSaasConfig = (config: ApiConfig) => {
  const saasConfig = config.saas;
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  return {
    excludeRoutePatterns: saasConfig.excludeRoutePatterns || [],
    handlers: saasConfig.handlers,
    subdomains: saasConfig.subdomains,
    multiDatabase: {
      enabled: saasConfig.multiDatabase?.enabled || false,
      migrations: {
        path:
          saasConfig.multiDatabase?.migrations?.path ||
          `${migrationsPath}/customers`,
      },
    },
    routes: saasConfig.routes,
    apps: saasConfig.apps || [
      {
        name: "admin",
        subdomain: "admin",
      },
    ],
    invalid: {
      domains: saasConfig.invalid?.domains || [],
      slugs: saasConfig.invalid?.domains || ["admin"],
    },
    routePrefix: saasConfig.routePrefix,
    mainAppSubdomain: saasConfig.mainAppSubdomain || "app",
    rootDomain: saasConfig.rootDomain,
  };
};

export default getSaasConfig;
