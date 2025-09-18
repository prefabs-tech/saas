import getSaasConfig from "../config";

import type { ApiConfig } from "@prefabs.tech/fastify-config";

const getInvalidSlugs = (config: ApiConfig) => {
  const saasConfig = getSaasConfig(config);

  const invalidSlugs = saasConfig.invalid.slugs || [];

  invalidSlugs.push(saasConfig.mainApp.subdomain);

  for (const app of saasConfig.apps) {
    if (app.subdomain) {
      invalidSlugs.push(app.subdomain);
    }
  }

  return invalidSlugs;
};

export default getInvalidSlugs;
