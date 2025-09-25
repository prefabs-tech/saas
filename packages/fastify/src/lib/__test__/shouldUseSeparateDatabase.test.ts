import { describe, it, expect } from "vitest";

import shouldUseSeparateDatabase from "../shouldUseSeparateDatabase";

import type { AccountCreateInput } from "../../types";
import type { ApiConfig } from "@prefabs.tech/fastify-config";

describe("shouldUseSeparateDatabase", () => {
  const cases = [
    {
      subdomains: "disabled",
      multiDatabase: "required",
      slug: "foo",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "required",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "optional",
      slug: "foo",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "optional",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "disabled",
      slug: "foo",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "disabled",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "required",
      multiDatabase: "required",
      slug: "foo",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "required",
      multiDatabase: "required",
      slug: "foo",
      useSeparateDatabase: false,
      expected: true,
    },
    {
      subdomains: "required",
      multiDatabase: "optional",
      slug: "foo",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "required",
      multiDatabase: "optional",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "required",
      multiDatabase: "disabled",
      slug: "foo",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "required",
      multiDatabase: "disabled",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },

    {
      subdomains: "optional",
      multiDatabase: "disabled",
      slug: "foo",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "optional",
      multiDatabase: "disabled",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "optional",
      multiDatabase: "required",
      slug: "foo",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "optional",
      multiDatabase: "required",
      slug: "foo",
      useSeparateDatabase: false,
      expected: true,
    },
    {
      subdomains: "optional",
      multiDatabase: "required",
      slug: undefined,
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "optional",
      multiDatabase: "optional",
      slug: "foo",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "optional",
      multiDatabase: "optional",
      slug: "foo",
      useSeparateDatabase: false,
      expected: false,
    },
  ];

  for (const {
    expected,
    multiDatabase,
    subdomains,
    slug,
    useSeparateDatabase,
  } of cases) {
    const config = {
      saas: {
        subdomains,
        multiDatabase: { mode: multiDatabase },
      },
    } as ApiConfig;
    const input: AccountCreateInput = { slug, useSeparateDatabase };

    it(`subdomains=${subdomains}, multiDatabase.mode=${multiDatabase}, useSeparateDatabase=${useSeparateDatabase} => ${expected}`, () => {
      expect(shouldUseSeparateDatabase(config, input)).toBe(expected);
    });
  }
});
