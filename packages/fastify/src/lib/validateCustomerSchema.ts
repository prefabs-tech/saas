import { customerCreateInputSchema } from "../schemas";
import getInvalidDomains from "./getInvalidDomains";
import getInvalidSlugs from "./getInvalidSlugs";
import getSaasConfig from "../config";

import type { CustomerCreateInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const validateCustomerInput = (
  config: ApiConfig,
  customerInput: CustomerCreateInput,
) => {
  const saasConfig = getSaasConfig(config);
  const customerInputSchema = customerCreateInputSchema(saasConfig);

  const validationResult = customerInputSchema.safeParse(customerInput);

  if (!validationResult.success) {
    const errorField = validationResult.error.issues[0]?.path?.[0] || "unknown";

    throw {
      name: `ERROR_INVALID_${errorField}`.toUpperCase(),
      message: `Invalid ${errorField}`,
      statusCode: 422,
    };
  }

  if (getInvalidSlugs(config).includes(customerInput.slug as string)) {
    throw {
      name: "ERROR_INVALID_SLUG",
      message: `The requested slug "${customerInput.slug}" is invalid and cannot be used`,
      statusCode: 422,
    };
  }

  if (getInvalidDomains(config).includes(customerInput.domain as string)) {
    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: `The requested domain "${customerInput.domain}" is invalid and cannot be used`,
      statusCode: 422,
    };
  }
};

export { validateCustomerInput };
