import type { ApiConfig } from "@dzangolab/fastify-config";

const getSubdomainsConfig = (config: ApiConfig) => {
  const subdomainsConfig = config.saas?.subdomains;
  const migrationsPath = config.slonik?.migrations?.path || "migrations";

  return {
    enabled: subdomainsConfig?.enabled ?? false,
    migrations: {
      path: subdomainsConfig?.migrations?.path || `${migrationsPath}/customers`,
    },
    multiDatabase: subdomainsConfig?.multiDatabase ?? true,
    reserved: {
      admin: {
        domains: subdomainsConfig?.reserved?.admin?.domains || [],
        enabled: subdomainsConfig?.reserved?.admin?.enabled ?? true,
        slugs: subdomainsConfig?.reserved?.admin?.slugs || ["admin"],
      },
      blacklisted: {
        domains: subdomainsConfig?.reserved?.blacklisted?.domains || [],
        enabled: subdomainsConfig?.reserved?.blacklisted?.enabled ?? true,
        slugs: subdomainsConfig?.reserved?.blacklisted?.slugs || [],
      },
      others: {
        domains: subdomainsConfig?.reserved?.others?.domains || [],
        enabled: subdomainsConfig?.reserved?.others?.enabled ?? true,
        slugs: subdomainsConfig?.reserved?.others?.slugs || [],
      },
      www: {
        domains: subdomainsConfig?.reserved?.www?.domains || [],
        enabled: subdomainsConfig?.reserved?.www?.enabled ?? true,
        slugs: subdomainsConfig?.reserved?.www?.slugs || ["www"],
      },
    },
    required: subdomainsConfig?.required ?? true,
    rootDomain: subdomainsConfig?.rootDomain,
  };
};

export default getSubdomainsConfig;
