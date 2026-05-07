import type { ApiConfig } from "@prefabs.tech/fastify-config";

import getSaasConfig from "../config";

const getInvalidDomains = (config: ApiConfig) => {
  const saasConfig = getSaasConfig(config);

  return saasConfig.invalid.domains || [];
};

export default getInvalidDomains;
