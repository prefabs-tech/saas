/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import configPlugin from "@dzangolab/fastify-config";
import Fastify, { FastifyInstance, FastifyReply } from "fastify";
import FastifyPlugin from "fastify-plugin";
import { SessionRequest } from "supertokens-node/framework/fastify";
import { describe, it, expect, vi } from "vitest";

import plugin from "../src/index";

vi.mock("../src/migrations/runMigrations");

vi.mock("@dzangolab/fastify-user", () => ({
  __esModule: true,
  default: FastifyPlugin(
    async (fastify: FastifyInstance, options: unknown, done: () => void) => {},
  ),
  userPlugin: FastifyPlugin(
    async (fastify: FastifyInstance, options: unknown, done: () => void) => {},
  ),
}));

describe("plugin", () => {
  it("should be exported as default and register without issues", async () => {
    const fastify = Fastify();
    fastify.register(configPlugin, {
      config: {
        user: {},
        saas: {
          routePrefix: undefined,
        },
      },
    });

    fastify.decorate("verifySession", (options?: unknown) => {
      return async function (
        req: SessionRequest,
        res: FastifyReply,
      ): Promise<void> {
        // Mocked example function
        return;
      };
    });

    await expect(fastify.register(plugin)).resolves.not.toThrow();
  });
});
