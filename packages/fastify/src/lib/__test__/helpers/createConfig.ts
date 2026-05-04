import type { ApiConfig } from "@prefabs.tech/fastify-config";

/* istanbul ignore file */
import type { SaasConfig } from "../../../types";

declare module "@prefabs.tech/fastify-config" {
  interface ApiConfig {
    saas?: SaasConfig;
  }
}

const createConfig = (saasConfig: Partial<SaasConfig>) => {
  const config: ApiConfig = {
    appName: "app",
    appOrigin: ["http://localhost"],
    baseUrl: "http://localhost",
    env: "development",
    graphql: {},
    logger: {
      level: "debug",
    },
    name: "Test",
    port: 3000,
    protocol: "http",
    rest: {
      enabled: true,
    },
    saas: {
      rootDomain: "example.test",
      ...saasConfig,
    },
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
    },
    version: "0.1",
  } as ApiConfig;

  return config;
};

export default createConfig;
