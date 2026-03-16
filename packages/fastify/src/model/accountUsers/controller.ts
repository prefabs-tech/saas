import handlers from "./handlers";
import ensureUserEnabledForAccount from "../../lib/ensureUserEnabledForAccount";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.saas?.handlers?.accountUser;

  const accountScopedPreHandler = [
    fastify.verifySession(),
    ensureUserEnabledForAccount,
  ];

  fastify.get(
    String.raw`/accounts/:accountId(^[0-9a-fa-f-]{36}$)/users`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.getByAccountId || handlers.getByAccountId,
  );

  fastify.post(
    String.raw`/accounts/:accountId(^[0-9a-fa-f-]{36}$)/users/:userId/disable`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.disableAccountUser || handlers.disableAccountUser,
  );

  fastify.post(
    String.raw`/accounts/:accountId(^[0-9a-fa-f-]{36}$)/users/:userId/enable`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.enableAccountUser || handlers.enableAccountUser,
  );
};

export default plugin;
