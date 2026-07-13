/* eslint-disable unicorn/no-null */
import type { ApiConfig } from "@prefabs.tech/fastify-config";

import errorHandlerPlugin from "@prefabs.tech/fastify-error-handler";
import Fastify, { FastifyInstance } from "fastify";
import { Writable } from "node:stream";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Account } from "../src/types";

import AccountNotFoundError from "../src/lib/accountNotFoundError";
import discoverAccount from "../src/lib/discoverAccount";
import accountDiscoveryPlugin from "../src/plugins/accountDiscoveryPlugin";

// Mock discovery so we can drive each outcome (found / not-found / DB failure)
// without a database. A factory keeps the heavy real import graph out of the
// test (it transitively pulls in an ESM-incompatible dependency).
vi.mock("../src/lib/discoverAccount", () => ({ default: vi.fn() }));

const mockedDiscoverAccount = vi.mocked(discoverAccount);

const account = {
  database: null,
  id: "acc_1",
  slug: "acme",
} as unknown as Account;

const testConfig = {
  saas: {
    apps: [{ domain: "admin.example.test", name: "admin", subdomain: "admin" }],
    rootDomain: "example.test",
    subdomains: "required",
  },
} as unknown as ApiConfig;

// Captured pino log lines. Levels: debug=20, info=30, warn=40, error=50.
let logLines: Array<{ level: number }> = [];

const buildApp = async (): Promise<FastifyInstance> => {
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      logLines.push(JSON.parse(chunk.toString()));

      callback();
    },
  });

  const app = Fastify({ logger: { level: "debug", stream } });

  // Provide the request decorations the hook reads. `slonik` is only forwarded
  // to the (mocked) discoverAccount, so its value is irrelevant here.
  app.addHook("onRequest", async (request) => {
    request.config = testConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (request as any).slonik = {};
  });

  await app.register(errorHandlerPlugin, {});
  await app.register(accountDiscoveryPlugin);

  app.get("/resource", async (request) => ({
    account: request.account?.id ?? null,
  }));

  await app.ready();

  return app;
};

const maxLevel = () => Math.max(0, ...logLines.map((line) => line.level));

describe("accountDiscoveryPlugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logLines = [];
  });

  it("decorates the request and responds 200 when an account is found", async () => {
    mockedDiscoverAccount.mockResolvedValue(account);

    const app = await buildApp();

    const response = await app.inject({
      headers: { host: "acme.example.test" },
      method: "GET",
      url: "/resource",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ account: "acc_1" });
  });

  it("genuine not-found → 404 with the legacy body and no error/warn log", async () => {
    mockedDiscoverAccount.mockRejectedValue(new AccountNotFoundError());

    const app = await buildApp();

    const response = await app.inject({
      headers: { host: "ghost.example.test" },
      method: "GET",
      url: "/resource",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: { message: "Account not found" },
    });
    // Operational, expected — never logged loud enough to alert.
    expect(maxLevel()).toBeLessThan(40);
  });

  it("unexpected DB failure → 500 and an error-level log (not a 404)", async () => {
    mockedDiscoverAccount.mockRejectedValue(
      new Error("connection terminated unexpectedly"),
    );

    const app = await buildApp();

    const response = await app.inject({
      headers: { host: "acme.example.test" },
      method: "GET",
      url: "/resource",
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).not.toEqual({
      error: { message: "Account not found" },
    });
    // The central error handler must log system failures at error level.
    expect(maxLevel()).toBe(50);
  });

  it("does not 404 when discovery returns null (excluded route)", async () => {
    mockedDiscoverAccount.mockResolvedValue(null);

    const app = await buildApp();

    const response = await app.inject({
      headers: { host: "app.example.test" },
      method: "GET",
      url: "/resource",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ account: null });
  });

  it("skips discovery entirely for configured app domains", async () => {
    const app = await buildApp();

    const response = await app.inject({
      headers: { host: "admin.example.test" },
      method: "GET",
      url: "/resource",
    });

    expect(response.statusCode).toBe(200);
    expect(mockedDiscoverAccount).not.toHaveBeenCalled();
  });
});
