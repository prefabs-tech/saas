import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/session/types";

import { describe, expect, it, vi } from "vitest";

import verifySession from "../verifySession";

type TestRequest = {
  dbSchema?: string;
  user?: { deletedAt?: Date; disabled?: boolean };
};

const buildInput = (request: TestRequest) =>
  ({
    userContext: { _default: { request: { request } } },
  }) as unknown as Parameters<NonNullable<APIInterface["verifySession"]>>[0];

const buildOriginal = (session: unknown) => {
  const revokeSession = vi.fn();

  const originalImplementation = {
    verifySession: vi.fn(async () => (session ? { revokeSession } : undefined)),
  } as unknown as APIInterface;

  return { originalImplementation, revokeSession };
};

// `undefined` would trip the default parameter, so absence is spelled `null`.
const call = (request: TestRequest, session: unknown = {}) => {
  const { originalImplementation, revokeSession } = buildOriginal(session);

  const handler = verifySession(
    originalImplementation,
    {} as FastifyInstance,
  ) as NonNullable<APIInterface["verifySession"]>;

  return { result: handler(buildInput(request)), revokeSession };
};

describe("verifySession", () => {
  it("rejects a session whose user is not in the resolved account", async () => {
    const { result, revokeSession } = call({ dbSchema: "tenant_a" });

    await expect(result).rejects.toMatchObject({
      message: "user not found",
      name: "SESSION_VERIFICATION_FAILED",
      statusCode: 401,
    });

    // The session is still valid for its own account.
    expect(revokeSession).not.toHaveBeenCalled();
  });

  it("accepts a session whose user is in the resolved account", async () => {
    const { result } = call({ dbSchema: "tenant_a", user: {} });

    await expect(result).resolves.toBeDefined();
  });

  it("accepts a session when the request resolved no account schema", async () => {
    const { result } = call({});

    await expect(result).resolves.toBeDefined();
  });

  it("rejects and revokes a deleted user", async () => {
    const { result, revokeSession } = call({
      dbSchema: "tenant_a",
      user: { deletedAt: new Date() },
    });

    await expect(result).rejects.toMatchObject({ message: "user not found" });
    expect(revokeSession).toHaveBeenCalledOnce();
  });

  it("rejects and revokes a disabled user", async () => {
    const { result, revokeSession } = call({
      dbSchema: "tenant_a",
      user: { disabled: true },
    });

    await expect(result).rejects.toMatchObject({
      message: "user is disabled",
    });
    expect(revokeSession).toHaveBeenCalledOnce();
  });

  it("skips every check when there is no session", async () => {
    // eslint-disable-next-line unicorn/no-null
    const { result } = call({ dbSchema: "tenant_a" }, null);

    await expect(result).resolves.toBeUndefined();
  });
});
