import handlers from "./handlers";
import ensureUserEnabledForAccount from "../../lib/ensureUserEnabledForAccount";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.saas?.handlers?.account;

  const accountScopedPreHandler = [
    fastify.verifySession(),
    ensureUserEnabledForAccount,
  ];

  fastify.get(
    "/accounts",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.list || handlers.list,
  );

  fastify.get(
    String.raw`/accounts/:id(^[0-9a-fa-f-]{36}$)`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.getById || handlers.getById,
  );

  fastify.delete(
    String.raw`/accounts/:id(^[0-9a-fa-f-]{36}$)`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.delete || handlers.delete,
  );

  fastify.post(
    "/accounts",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.create,
  );

  fastify.put(
    String.raw`/accounts/:id(^[0-9a-fa-f-]{36}$)`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.update || handlers.update,
  );

  fastify.put(
    String.raw`/accounts/:id(^[0-9a-fa-f-]{36}$)/users`,
    {
      preHandler: accountScopedPreHandler,
    },
    handlersConfig?.update || handlers.update,
  );

  fastify.get(
    "/my-accounts",
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.myAccounts || handlers.myAccounts,
  );

  fastify.get(
    "/my-account",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.myAccount || handlers.myAccount,
  );

  fastify.put(
    "/my-account",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.updateMyAccount || handlers.updateMyAccount,
  );
};

export default plugin;
