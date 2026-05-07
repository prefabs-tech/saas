import { z } from "zod";

export const accountSchema = z.object({
  createdAt: z.number(),
  database: z.string().max(10).nullable().optional(),
  domain: z.string().max(255).nullable().optional(),
  id: z.string().uuid(),
  individual: z.boolean(),
  name: z.string().min(1).max(255),
  registeredNumber: z.string().max(255).nullable().optional(),
  slug: z.string().max(24).nullable().optional(),
  taxId: z.string().max(255).nullable().optional(),
  updatedAt: z.number(),
});
