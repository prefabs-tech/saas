import type { ApiConfig } from "@prefabs.tech/fastify-config";

import type { AccountCreateInput } from "../types";

import getSaasConfig from "../config";
import { accountCreateInputSchema } from "../schemas";
import getInvalidDomains from "./getInvalidDomains";
import getInvalidSlugs from "./getInvalidSlugs";

const validateAccountInput = (
  config: ApiConfig,
  accountInput: AccountCreateInput,
) => {
  const saasConfig = getSaasConfig(config);
  const accountInputSchema = accountCreateInputSchema(saasConfig);

  const validationResult = accountInputSchema.safeParse(accountInput);

  if (!validationResult.success) {
    const errorField = validationResult.error.issues[0]?.path?.[0] || "unknown";

    throw {
      message: `Invalid ${errorField}`,
      name: `ERROR_INVALID_${errorField}`.toUpperCase(),
      statusCode: 422,
    };
  }

  if (getInvalidSlugs(config).includes(accountInput.slug as string)) {
    throw {
      message: `The requested slug "${accountInput.slug}" is invalid and cannot be used`,
      name: "ERROR_INVALID_SLUG",
      statusCode: 422,
    };
  }

  if (getInvalidDomains(config).includes(accountInput.domain as string)) {
    throw {
      message: `The requested domain "${accountInput.domain}" is invalid and cannot be used`,
      name: "ERROR_INVALID_DOMAIN",
      statusCode: 422,
    };
  }
};

export { validateAccountInput };
