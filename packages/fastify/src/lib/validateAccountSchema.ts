import { accountCreateInputSchema } from "../schemas";
import getInvalidDomains from "./getInvalidDomains";
import getInvalidSlugs from "./getInvalidSlugs";
import getSaasConfig from "../config";

import type { AccountCreateInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

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
      name: `ERROR_INVALID_${errorField}`.toUpperCase(),
      message: `Invalid ${errorField}`,
      statusCode: 422,
    };
  }

  if (getInvalidSlugs(config).includes(accountInput.slug as string)) {
    throw {
      name: "ERROR_INVALID_SLUG",
      message: `The requested slug "${accountInput.slug}" is invalid and cannot be used`,
      statusCode: 422,
    };
  }

  if (getInvalidDomains(config).includes(accountInput.domain as string)) {
    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: `The requested domain "${accountInput.domain}" is invalid and cannot be used`,
      statusCode: 422,
    };
  }
};

export { validateAccountInput };
