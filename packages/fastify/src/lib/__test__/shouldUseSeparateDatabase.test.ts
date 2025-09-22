import { describe, it, expect } from "vitest";

import shouldUseSeparateDatabase from "../shouldUseSeparateDatabase";

import type { AccountCreateInput } from "../../types";
import type { ApiConfig } from "@prefabs.tech/fastify-config";

describe("shouldUseSeparateDatabase", () => {
  const cases = [
    {
      subdomains: "disabled",
      multiDatabase: "required",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "required",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "optional",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "optional",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "disabled",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "disabled",
      multiDatabase: "disabled",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "required",
      multiDatabase: "required",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "required",
      multiDatabase: "required",
      useSeparateDatabase: false,
      expected: true,
    },
    {
      subdomains: "required",
      multiDatabase: "optional",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "required",
      multiDatabase: "optional",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "required",
      multiDatabase: "disabled",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "required",
      multiDatabase: "disabled",
      useSeparateDatabase: false,
      expected: false,
    },

    {
      subdomains: "optional",
      multiDatabase: "disabled",
      useSeparateDatabase: true,
      expected: false,
    },
    {
      subdomains: "optional",
      multiDatabase: "disabled",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "optional",
      multiDatabase: "required",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "optional",
      multiDatabase: "required",
      useSeparateDatabase: false,
      expected: false,
    },
    {
      subdomains: "optional",
      multiDatabase: "optional",
      useSeparateDatabase: true,
      expected: true,
    },
    {
      subdomains: "optional",
      multiDatabase: "optional",
      useSeparateDatabase: false,
      expected: false,
    },
  ];

  for (const {
    subdomains,
    multiDatabase,
    useSeparateDatabase,
    expected,
  } of cases) {
    const config = {
      saas: {
        subdomains,
        multiDatabase: { mode: multiDatabase },
      },
    } as ApiConfig;
    const input: AccountCreateInput = { slug: "foo", useSeparateDatabase };

    it(`subdomains=${subdomains}, multiDatabase.mode=${multiDatabase}, useSeparateDatabase=${useSeparateDatabase} => ${expected}`, () => {
      expect(shouldUseSeparateDatabase(config, input)).toBe(expected);
    });
  }
});
