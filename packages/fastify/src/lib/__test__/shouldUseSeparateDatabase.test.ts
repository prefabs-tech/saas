import type { ApiConfig } from "@prefabs.tech/fastify-config";

import { describe, expect, it } from "vitest";

import type { AccountCreateInput } from "../../types";

import shouldUseSeparateDatabase from "../shouldUseSeparateDatabase";

describe("shouldUseSeparateDatabase", () => {
  const cases = [
    {
      expected: false,
      multiDatabase: "required",
      slug: "foo",
      subdomains: "disabled",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "required",
      slug: "foo",
      subdomains: "disabled",
      useSeparateDatabase: false,
    },
    {
      expected: false,
      multiDatabase: "optional",
      slug: "foo",
      subdomains: "disabled",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "optional",
      slug: "foo",
      subdomains: "disabled",
      useSeparateDatabase: false,
    },
    {
      expected: false,
      multiDatabase: "disabled",
      slug: "foo",
      subdomains: "disabled",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "disabled",
      slug: "foo",
      subdomains: "disabled",
      useSeparateDatabase: false,
    },
    {
      expected: true,
      multiDatabase: "required",
      slug: "foo",
      subdomains: "required",
      useSeparateDatabase: true,
    },
    {
      expected: true,
      multiDatabase: "required",
      slug: "foo",
      subdomains: "required",
      useSeparateDatabase: false,
    },
    {
      expected: true,
      multiDatabase: "optional",
      slug: "foo",
      subdomains: "required",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "optional",
      slug: "foo",
      subdomains: "required",
      useSeparateDatabase: false,
    },
    {
      expected: false,
      multiDatabase: "disabled",
      slug: "foo",
      subdomains: "required",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "disabled",
      slug: "foo",
      subdomains: "required",
      useSeparateDatabase: false,
    },

    {
      expected: false,
      multiDatabase: "disabled",
      slug: "foo",
      subdomains: "optional",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "disabled",
      slug: "foo",
      subdomains: "optional",
      useSeparateDatabase: false,
    },
    {
      expected: true,
      multiDatabase: "required",
      slug: "foo",
      subdomains: "optional",
      useSeparateDatabase: true,
    },
    {
      expected: true,
      multiDatabase: "required",
      slug: "foo",
      subdomains: "optional",
      useSeparateDatabase: false,
    },
    {
      expected: false,
      multiDatabase: "required",
      slug: undefined,
      subdomains: "optional",
      useSeparateDatabase: false,
    },
    {
      expected: true,
      multiDatabase: "optional",
      slug: "foo",
      subdomains: "optional",
      useSeparateDatabase: true,
    },
    {
      expected: false,
      multiDatabase: "optional",
      slug: "foo",
      subdomains: "optional",
      useSeparateDatabase: false,
    },
  ];

  for (const {
    expected,
    multiDatabase,
    slug,
    subdomains,
    useSeparateDatabase,
  } of cases) {
    const config = {
      saas: {
        multiDatabase: { mode: multiDatabase },
        subdomains,
      },
    } as ApiConfig;
    const input: AccountCreateInput = { slug, useSeparateDatabase };

    it(`subdomains=${subdomains}, multiDatabase.mode=${multiDatabase}, useSeparateDatabase=${useSeparateDatabase} => ${expected}`, () => {
      expect(shouldUseSeparateDatabase(config, input)).toBe(expected);
    });
  }
});
