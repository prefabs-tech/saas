import getSubdomainsConfig from "./getSubdomainsConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getAllReservedDomains = (config: ApiConfig) => {
  const reserved = getSubdomainsConfig(config).reserved;

  let allReservedDomain: string[] = [];

  for (const [, app] of Object.entries(reserved)) {
    if (app.enabled) {
      allReservedDomain = [...allReservedDomain, ...app.domains];
    }
  }

  return allReservedDomain;
};

export default getAllReservedDomains;
