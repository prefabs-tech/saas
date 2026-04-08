import configPlugin from "@prefabs.tech/fastify-config";
import Fastify from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import discoverAccount from "../src/lib/discoverAccount";
import accountDiscoveryPlugin from "../src/plugins/accountDiscoveryPlugin";

vi.mock("../src/lib/discoverAccount", () => ({
  default: vi.fn(),
}));

const mockDiscoverAccount = vi.mocked(discoverAccount);

const baseConfig = {
  saas: { rootDomain: "example.test" },
  user: {},
};

type CapturedRequest = {
  account: unknown;
  dbSchema: unknown;
  authEmailPrefix: unknown;
};

describe("accountDiscoveryPlugin", () => {
  let fastify: ReturnType<typeof Fastify>;
  let captured: CapturedRequest;

  beforeEach(() => {
    captured = {
      account: undefined,
      dbSchema: undefined,
      authEmailPrefix: undefined,
    };

    fastify = Fastify({ logger: false });

    fastify.register(configPlugin, { config: baseConfig });
    fastify.register(accountDiscoveryPlugin);

    // Routes used across multiple tests
    fastify.get("/test", async (req) => {
      captured.account = req.account;
      captured.dbSchema = (req as Record<string, unknown>).dbSchema;
      captured.authEmailPrefix = req.authEmailPrefix;
      return { ok: true };
    });
    fastify.get("/", async () => ({ ok: true }));
    fastify.get("/auth/login", async () => ({ ok: true }));
    fastify.get("/me", async () => ({ ok: true }));
    fastify.get(
      "/excluded",
      { config: { saas: { exclude: true } } },
      async () => ({ ok: true }),
    );
  });

  afterEach(async () => {
    await fastify.close();
    vi.clearAllMocks();
  });

  it("sets request.account when account is discovered", async () => {
    const account = { id: "acc-1", name: "Acme" };
    mockDiscoverAccount.mockResolvedValue(account as never);

    await fastify.inject({ method: "GET", url: "/test" });

    expect(captured.account).toEqual(account);
  });

  it("sets request.dbSchema when account has database field", async () => {
    const account = { id: "acc-1", database: "s_abc12345" };
    mockDiscoverAccount.mockResolvedValue(account as never);

    await fastify.inject({ method: "GET", url: "/test" });

    expect(captured.dbSchema).toBe("s_abc12345");
  });

  it("sets request.authEmailPrefix to <id>_ when account has slug", async () => {
    const account = { id: "acc-1", slug: "myslug" };
    mockDiscoverAccount.mockResolvedValue(account as never);

    await fastify.inject({ method: "GET", url: "/test" });

    expect(captured.authEmailPrefix).toBe("acc-1_");
  });

  it("does not set authEmailPrefix when account has no slug", async () => {
    const account = { id: "acc-1" };
    mockDiscoverAccount.mockResolvedValue(account as never);

    await fastify.inject({ method: "GET", url: "/test" });

    expect(captured.authEmailPrefix).toBeUndefined();
  });

  it("does not set account when discoverAccount returns null", async () => {
    mockDiscoverAccount.mockResolvedValue(undefined as never);

    await fastify.inject({ method: "GET", url: "/test" });

    expect(captured.account).toBeUndefined();
  });

  it("replies 404 with error body when discoverAccount throws", async () => {
    mockDiscoverAccount.mockRejectedValue(new Error("Account not found"));

    const res = await fastify.inject({ method: "GET", url: "/test" });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: { message: "Account not found" } });
  });

  it("extracts hostname from referer header when present", async () => {
    mockDiscoverAccount.mockResolvedValue(undefined as never);

    await fastify.inject({
      method: "GET",
      url: "/test",
      headers: { referer: "https://tenant.example.test/some/path" },
    });

    expect(mockDiscoverAccount.mock.calls[0][2]).toBe("tenant.example.test");
  });

  it("does not call discoverAccount for requests matching a configured app domain", async () => {
    // admin.example.test is the default app domain (apps: [{ subdomain: "admin" }])
    await fastify.inject({
      method: "GET",
      url: "/test",
      headers: { host: "admin.example.test" },
    });

    expect(mockDiscoverAccount).not.toHaveBeenCalled();
  });

  it("calls discoverAccount with isRouteExcluded=true for root route", async () => {
    mockDiscoverAccount.mockResolvedValue(undefined as never);

    await fastify.inject({ method: "GET", url: "/" });

    expect(mockDiscoverAccount).toHaveBeenCalled();
    expect(mockDiscoverAccount.mock.calls[0][4]).toBe(true);
  });

  it("calls discoverAccount with isRouteExcluded=true for /auth/ routes", async () => {
    mockDiscoverAccount.mockResolvedValue(undefined as never);

    await fastify.inject({ method: "GET", url: "/auth/login" });

    expect(mockDiscoverAccount).toHaveBeenCalled();
    expect(mockDiscoverAccount.mock.calls[0][4]).toBe(true);
  });

  it("calls discoverAccount with isRouteExcluded=true for per-route excluded routes", async () => {
    mockDiscoverAccount.mockResolvedValue(undefined as never);

    await fastify.inject({ method: "GET", url: "/excluded" });

    expect(mockDiscoverAccount).toHaveBeenCalled();
    expect(mockDiscoverAccount.mock.calls[0][4]).toBe(true);
  });

  it("calls discoverAccount with isRouteExcluded=false for normal routes", async () => {
    mockDiscoverAccount.mockResolvedValue(undefined as never);

    await fastify.inject({
      method: "GET",
      url: "/test",
      headers: { host: "tenant.example.test" },
    });

    expect(mockDiscoverAccount).toHaveBeenCalled();
    expect(mockDiscoverAccount.mock.calls[0][4]).toBe(false);
  });
});
