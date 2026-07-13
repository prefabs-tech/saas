/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Account } from "../../types";

import AccountService from "../../model/accounts/service";
import AccountNotFoundError from "../accountNotFoundError";
import discoverAccount from "../discoverAccount";
import createConfig from "./helpers/createConfig";

vi.mock("../../model/accounts/service", () => ({ default: vi.fn() }));

const database = {} as unknown as Database;

const account = { id: "acc_1", slug: "acme" } as unknown as Account;

const mockService = (overrides: {
  findByHostname?: ReturnType<typeof vi.fn>;
  findOne?: ReturnType<typeof vi.fn>;
}) => {
  const findByHostname = overrides.findByHostname ?? vi.fn();
  const findOne = overrides.findOne ?? vi.fn();

  vi.mocked(AccountService).mockImplementation(
    () => ({ findByHostname, findOne }) as unknown as AccountService,
  );

  return { findByHostname, findOne };
};

// subdomains !== "disabled" keeps mainApp.skipHostnameCheck false, so a
// non-mainApp hostname is resolved through the hostname branch.
const hostnameConfig = (): ApiConfig =>
  createConfig({ rootDomain: "example.test", subdomains: "required" });

// subdomains === "disabled" forces mainApp.skipHostnameCheck true, so
// resolution goes through the account-id header branch.
const mainAppConfig = (): ApiConfig =>
  createConfig({ rootDomain: "example.test", subdomains: "disabled" });

describe("discoverAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hostname branch", () => {
    it("returns the account when the hostname matches", async () => {
      const { findByHostname } = mockService({
        findByHostname: vi.fn().mockResolvedValue(account),
      });

      await expect(
        discoverAccount(
          hostnameConfig(),
          database,
          "acme.example.test",
          undefined,
        ),
      ).resolves.toBe(account);

      expect(findByHostname).toHaveBeenCalledWith("acme.example.test");
    });

    it("throws AccountNotFoundError when no account matches the hostname", async () => {
      mockService({ findByHostname: vi.fn().mockResolvedValue(null) });

      await expect(
        discoverAccount(
          hostnameConfig(),
          database,
          "ghost.example.test",
          undefined,
        ),
      ).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it("propagates the original error when the query fails (DB outage)", async () => {
      const dbError = new Error("connection terminated unexpectedly");

      mockService({ findByHostname: vi.fn().mockRejectedValue(dbError) });

      const promise = discoverAccount(
        hostnameConfig(),
        database,
        "acme.example.test",
        undefined,
      );

      await expect(promise).rejects.toBe(dbError);
      await expect(promise).rejects.not.toBeInstanceOf(AccountNotFoundError);
    });
  });

  describe("account-id header branch", () => {
    it("returns null for excluded routes without touching the database", async () => {
      const { findOne } = mockService({});

      await expect(
        discoverAccount(
          mainAppConfig(),
          database,
          "app.example.test",
          "acc_1",
          true,
        ),
      ).resolves.toBeNull();

      expect(findOne).not.toHaveBeenCalled();
    });

    it("returns the account when the id resolves", async () => {
      mockService({ findOne: vi.fn().mockResolvedValue(account) });

      await expect(
        discoverAccount(mainAppConfig(), database, "app.example.test", "acc_1"),
      ).resolves.toBe(account);
    });

    it("throws AccountNotFoundError when the id does not resolve", async () => {
      mockService({ findOne: vi.fn().mockResolvedValue(null) });

      await expect(
        discoverAccount(mainAppConfig(), database, "app.example.test", "acc_1"),
      ).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it("throws AccountNotFoundError when no account id is supplied", async () => {
      const { findOne } = mockService({});

      await expect(
        discoverAccount(
          mainAppConfig(),
          database,
          "app.example.test",
          undefined,
        ),
      ).rejects.toBeInstanceOf(AccountNotFoundError);

      expect(findOne).not.toHaveBeenCalled();
    });

    it("propagates the original error when the query fails (DB outage)", async () => {
      const dbError = new Error("statement timeout");

      mockService({ findOne: vi.fn().mockRejectedValue(dbError) });

      const promise = discoverAccount(
        mainAppConfig(),
        database,
        "app.example.test",
        "acc_1",
      );

      await expect(promise).rejects.toBe(dbError);
      await expect(promise).rejects.not.toBeInstanceOf(AccountNotFoundError);
    });
  });
});
