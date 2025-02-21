import { describe, expect, it } from "vitest";

import getSaasConfig from "../../config";
import { accountCreateInputSchema } from "../../schemas";

const saasConfig = getSaasConfig({
  saas: {
    subdomains: "optional",
  },
});

const slugSchema = accountCreateInputSchema(saasConfig).shape.slug;

describe.concurrent("slugSchema", () => {
  it.each([
    ["a", true],
    ["a1", true],
    ["abc", true],
    ["tenant1", true],
    ["a-b", true],
    ["a-1", true],
    ["", false],
    ["a-1", true],
    ["", false],
    ["1", true],
    ["12", true],
    ["1 2", false],
    ["a ", false],
    ["a b", false],
    ["A", false],
    ["Z1", false],
    ["1tenant", true],
    ["-ab", false],
    ["a1-", false],
    [undefined, true],
  ])("slugSchema.safeParse(slug) -> expected", async (slug, expected) => {
    expect(slugSchema.safeParse(slug).success).toBe(expected);
  });
});
