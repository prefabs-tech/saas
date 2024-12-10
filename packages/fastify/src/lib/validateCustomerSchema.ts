import { z } from "zod";

import type { CustomerCreateInput, CustomerUpdateInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const domainSchema = z.optional(
  z
    .string()
    .max(255)
    .regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/),
);

const slugSchema = z.string().regex(/^(?!.*-+$)[a-z][\da-z-]{0,24}([\da-z])?$/);

const validateCustomerInput = (customerInput: CustomerCreateInput) => {
  const customerInputSchema = z.object({
    slug: slugSchema,
    domain: domainSchema,
  });

  const validationResult = customerInputSchema.safeParse({
    slug: customerInput.slug,
    domain: customerInput.domain,
  });

  if (!validationResult.success) {
    if (
      validationResult.error.issues.some((issue) => {
        return issue.path.includes("slug");
      })
    ) {
      throw {
        name: "ERROR_INVALID_SLUG",
        message: "Invalid slug",
        statusCode: 422,
      };
    }

    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422,
    };
  }
};

const validateTenantUpdate = (
  config: ApiConfig,
  customerUpdateInput: CustomerUpdateInput,
) => {
  const tenantInputSchema = z.object({
    domain: domainSchema,
  });

  const validationResult = tenantInputSchema.safeParse({
    domain: customerUpdateInput.domain,
  });

  if (!validationResult.success) {
    throw {
      name: "ERROR_INVALID_DOMAIN",
      message: "Invalid domain",
      statusCode: 422,
    };
  }
};

export {
  domainSchema,
  slugSchema,
  validateCustomerInput,
  validateTenantUpdate,
};
