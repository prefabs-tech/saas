import getSubdomainsConfig from "./getSubdomainsConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getAllReservedSlugs = (config: ApiConfig) => {
  const reserved = getSubdomainsConfig(config).reserved;

  let allReservedSlugs: string[] = [];

  for (const [, app] of Object.entries(reserved)) {
    if (app.enabled) {
      allReservedSlugs = [...allReservedSlugs, ...app.slugs];
    }
  }

  return allReservedSlugs;
};

export default getAllReservedSlugs;
