import type { ApiConfig } from "@prefabs.tech/fastify-config";

import type { AccountCreateInput } from "../types";

import getSaasConfig from "../config";

const shouldUseSeparateDatabase = (
  config: ApiConfig,
  data: AccountCreateInput,
) => {
  const { multiDatabase, subdomains } = getSaasConfig(config);
  let useSeparateDatabase = false;

  switch (subdomains) {
    case "disabled": {
      useSeparateDatabase = false;
      break;
    }

    case "optional": {
      if (
        (multiDatabase.mode === "optional" &&
          data.slug &&
          data.useSeparateDatabase) ||
        (multiDatabase.mode === "required" && data.slug)
      ) {
        useSeparateDatabase = true;
      }

      break;
    }
    case "required": {
      if (
        multiDatabase.mode === "required" ||
        (multiDatabase.mode === "optional" &&
          data.slug &&
          data.useSeparateDatabase)
      ) {
        useSeparateDatabase = true;
      }

      break;
    }
  }

  return useSeparateDatabase;
};

export default shouldUseSeparateDatabase;
