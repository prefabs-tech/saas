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
    excludeRoutePatterns: saasConfig.excludeRoutePatterns || [],
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
  };
};

export default getSaasConfig;
