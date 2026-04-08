import { describe, expect, it, vi, beforeEach } from "vitest";

import discoverAccount from "../discoverAccount";

vi.mock("../../../src/model/accounts/service", () => ({
  default: vi.fn(),
}));

import AccountService from "../../model/accounts/service";

const MockAccountService = vi.mocked(AccountService as unknown as {
  new (...args: unknown[]): {
    findByHostname: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
  };
});

import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { SaasConfig } from "../../types";

declare module "@prefabs.tech/fastify-config" {
  interface ApiConfig {
    saas?: SaasConfig;
  }
}

const mockFindByHostname = vi.fn();
const mockFindOne = vi.fn();

const subdomainConfig = {
  saas: { rootDomain: "example.test", subdomains: "required" },
} as ApiConfig;

const headerOnlyConfig = {
  saas: { rootDomain: "example.test", subdomains: "disabled" },
} as ApiConfig;

const database = {} as never;

beforeEach(() => {
  vi.clearAllMocks();
  MockAccountService.mockImplementation(() => ({
    findByHostname: mockFindByHostname,
    findOne: mockFindOne,
  }));
});

describe("discoverAccount", () => {
  describe("hostname-based discovery (subdomains active)", () => {
    it("resolves account via hostname when hostname is not the main app domain", async () => {
      const account = { id: "acc-1", name: "Tenant" };
      mockFindByHostname.mockResolvedValue(account);

      const result = await discoverAccount(
        subdomainConfig,
        database,
        "tenant.example.test",
        undefined,
        false,
      );

      expect(mockFindByHostname).toHaveBeenCalledWith("tenant.example.test");
      expect(result).toEqual(account);
    });

    it("throws when hostname-based lookup returns null", async () => {
      mockFindByHostname.mockResolvedValue(null);

      await expect(
        discoverAccount(subdomainConfig, database, "unknown.example.test", undefined, false),
      ).rejects.toThrow("Account not found");
    });
  });

  describe("header-based discovery (skipHostnameCheck / main app domain)", () => {
    it("resolves account by id header when subdomains is disabled", async () => {
      const account = { id: "acc-1", name: "Header Account" };
      mockFindOne.mockResolvedValue(account);

      const result = await discoverAccount(
        headerOnlyConfig,
        database,
        "app.example.test",
        "acc-1",
        false,
      );

      expect(mockFindOne).toHaveBeenCalled();
      expect(result).toEqual(account);
    });

    it("resolves account by id header when hostname matches main app domain", async () => {
      const account = { id: "acc-2", name: "App Domain Account" };
      mockFindOne.mockResolvedValue(account);

      const result = await discoverAccount(
        subdomainConfig,
        database,
        "app.example.test",
        "acc-2",
        false,
      );

      expect(mockFindOne).toHaveBeenCalled();
      expect(result).toEqual(account);
    });

    it("returns null when route is excluded and on main app domain", async () => {
      const result = await discoverAccount(
        headerOnlyConfig,
        database,
        "app.example.test",
        "acc-1",
        true,
      );

      expect(result).toBeNull();
      expect(mockFindOne).not.toHaveBeenCalled();
    });

    it("throws without calling findOne when id header is absent", async () => {
      await expect(
        discoverAccount(headerOnlyConfig, database, "app.example.test", undefined, false),
      ).rejects.toThrow("Account not found");

      // getAccountById short-circuits on undefined id — findOne is never called
      expect(mockFindOne).not.toHaveBeenCalled();
    });

    it("throws when header-based lookup returns null", async () => {
      mockFindOne.mockResolvedValue(null);

      await expect(
        discoverAccount(headerOnlyConfig, database, "app.example.test", "missing-id", false),
      ).rejects.toThrow("Account not found");
    });
  });
});
