import { z } from "zod";

import type { SaasConfig } from "../types";

const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  organization_name: z.string().max(255).nullable().optional(),
  registered_number: z.string().max(255).nullable().optional(),
  tax_id: z.string().max(255).nullable().optional(),
  individual: z.boolean(),
  slug: z.string().max(24).nullable().optional(),
  database: z.string().max(10).nullable().optional(),
  domain: z.string().max(255).nullable().optional(),
  created_at: z.number(),
  updated_at: z.number(),
});

const customerCreateInputSchema = (saasConfig: SaasConfig) => {
  const subdomainsConfig = saasConfig.subdomains;

  return z.object({
    name: z.string().min(1).max(255),
    organization_name: z.string().max(255).nullable().optional(),
    registered_number: z.string().max(255).nullable().optional(),
    tax_id: z.string().max(255).nullable().optional(),
    individual: z.boolean(),
    slug:
      subdomainsConfig === "required"
        ? z.string().regex(/^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/)
        : z
            .string()
            .regex(/^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/)
            .nullable()
            .optional(),
    database: z.string().max(10).nullable().optional(),
    domain: z
      .string()
      .max(255)
      .regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/)
      .nullable()
      .optional(),
  });
};

export { customerSchema, customerCreateInputSchema };
