import { z } from "zod";

export const accountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  registeredNumber: z.string().max(255).nullable().optional(),
  taxId: z.string().max(255).nullable().optional(),
  individual: z.boolean(),
  slug: z.string().max(24).nullable().optional(),
  database: z.string().max(10).nullable().optional(),
  domain: z.string().max(255).nullable().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
