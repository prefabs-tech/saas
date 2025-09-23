import getSaasConfig from "../config";

import type { AccountCreateInput } from "../types";
import type { ApiConfig } from "@prefabs.tech/fastify-config";

const shouldUseSeparateDatabase = (
  config: ApiConfig,
  data: AccountCreateInput,
) => {
  const { subdomains, multiDatabase } = getSaasConfig(config);
  let useSeparateDatabase = false;

  switch (subdomains) {
    case "disabled": {
      useSeparateDatabase = false;
      break;
    }

    case "required": {
      if (multiDatabase.mode === "required") {
        useSeparateDatabase = true;
      } else if (
        multiDatabase.mode === "optional" &&
        data.slug &&
        data.useSeparateDatabase
      ) {
        useSeparateDatabase = true;
      }

      break;
    }
    case "optional": {
      if (
        multiDatabase.mode === "optional" &&
        data.slug &&
        data.useSeparateDatabase
      ) {
        useSeparateDatabase = true;
      } else if (multiDatabase.mode === "required" && data.slug) {
        useSeparateDatabase = true;
      }

      break;
    }
  }

  return useSeparateDatabase;
};

export default shouldUseSeparateDatabase;
