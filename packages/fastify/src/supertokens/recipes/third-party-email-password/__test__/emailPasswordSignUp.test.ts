import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmailMock = vi.fn();

vi.mock("@prefabs.tech/fastify-user", () => ({
  areRolesExist: vi.fn().mockResolvedValue(true),
  getUserService: vi.fn(),
  sendEmail: (...arguments_: unknown[]) => sendEmailMock(...arguments_),
  verifyEmail: vi.fn(),
}));

// Imported after the mock so the override picks up the mocked sendEmail.
const { default: emailPasswordSignUp } = await import("../emailPasswordSignUp");

const accountId = "76948988-1313-4ff5-9138-3dd3a3c95c70_";
const cleanEmail = "user@example.com";

const buildFastify = () =>
  ({
    config: {
      user: {
        supertokens: {
          sendUserAlreadyExistsWarning: true,
        },
      },
    },
    log: {
      error: vi.fn(),
    },
    slonik: {},
  }) as unknown as FastifyInstance;

const buildOriginalImplementation = () =>
  ({
    emailPasswordSignUp: vi.fn().mockResolvedValue({
      status: "EMAIL_ALREADY_EXISTS_ERROR",
    }),
  }) as unknown as RecipeInterface;

describe("emailPasswordSignUp duplicate email warning", () => {
  beforeEach(() => {
    sendEmailMock.mockClear();
  });

  it("sends the warning with the unprefixed email in templateData", async () => {
    const fastify = buildFastify();
    const handler = emailPasswordSignUp(buildOriginalImplementation(), fastify);

    await handler({
      email: cleanEmail,
      password: "password",
      tenantId: "public",
      userContext: {
        authEmailPrefix: accountId,
      },
    } as Parameters<typeof handler>[0]);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);

    const payload = sendEmailMock.mock.calls[0][0];

    // Body renders {{emailId}} verbatim, so it must be the clean email.
    expect(payload.templateData.emailId).toBe(cleanEmail);
    expect(payload.templateData.emailId).not.toContain(accountId);

    // Recipient is also the clean email.
    expect(payload.to).toBe(cleanEmail);
  });
});
