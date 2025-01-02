import getSaasConfig from "../config";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getInvalidDomains = (config: ApiConfig) => {
  const saasConfig = getSaasConfig(config);

  return saasConfig.invalid.domains || [];
};

export default getInvalidDomains;
