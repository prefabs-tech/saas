import { describe, expect, it, vi } from "vitest";

import discoverCustomer from "../discoverCustomer";
import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";

import type { Customer } from "../../types";

const config = createConfig({
  subdomains: {
    enabled: true,
    rootDomain: "example.test",
    reserved: {
      admin: {
        domains: ["example-admin.test"],
        enabled: true,
        slugs: ["admin"],
      },
      blacklisted: {
        domains: ["example-blacklisted.test"],
        enabled: true,
        slugs: ["blacklisted"],
      },
      others: {
        domains: ["example-others.test"],
        enabled: true,
        slugs: ["others"],
      },
      www: {
        domains: ["example-www.test"],
        enabled: true,
        slugs: ["www"],
      },
    },
  },
});

const reservedDisabledConfig = createConfig({
  subdomains: {
    enabled: true,
    rootDomain: "example.test",
    reserved: {
      admin: {
        domains: ["example-admin.test"],
        enabled: false,
        slugs: ["admin"],
      },
      blacklisted: {
        domains: ["example-blacklisted.test"],
        enabled: false,
        slugs: ["blacklisted"],
      },
      others: {
        domains: ["example-others.test"],
        enabled: false,
        slugs: ["others"],
      },
      www: {
        domains: ["example-www.test"],
        enabled: false,
        slugs: ["www"],
      },
    },
  },
});

const customer = {
  id: 1,
  domain: "valid.example.test",
  name: "Valid customer",
  slug: "valid",
} as unknown as Customer;

vi.mock("../../model/customers/service", () => {
  return {
    default: vi.fn(() => ({
      findByHostname: async (domain: string) => {
        if (domain === "valid.example.test") {
          return customer;
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
      },
    })),
  };
});

describe.concurrent("discoverCustomer", async () => {
  const database = await createDatabase();

  it("should return null if reserved domain", async () => {
    expect(await discoverCustomer(config, database, "admin.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverCustomer(config, database, "example-admin.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(
      await discoverCustomer(config, database, "blacklisted.example.test"),
    ).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(
      await discoverCustomer(config, database, "example-blacklisted.test"),
    ).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(
      await discoverCustomer(config, database, "others.example.test"),
    ).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(
      await discoverCustomer(config, database, "example-others.test"),
    ).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverCustomer(config, database, "www.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverCustomer(config, database, "example-www.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );
  });

  it("should return error if reserved is disabled", async () => {
    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "admin.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "example-admin.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "blacklisted.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "example-blacklisted.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "others.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "example-others.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "www.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }

    try {
      await discoverCustomer(
        reservedDisabledConfig,
        database,
        "example-www.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }
  });

  it("should return customer if found", async () => {
    expect(await discoverCustomer(config, database, "valid.example.test")).toBe(
      customer,
    );
  });

  it("should throw error if no such customer exists", async () => {
    try {
      await discoverCustomer(config, database, "invalid.example.test");

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Customer not found");
    }
  });
});
