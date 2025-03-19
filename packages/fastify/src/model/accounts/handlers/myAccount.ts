import AccountUserService from "../../accountUsers/service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccount = async (request: SessionRequest, reply: FastifyReply) => {
  const { account, config, dbSchema, slonik, user } = request;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  if (!account) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const accountUserService = new AccountUserService(config, slonik, dbSchema);

  const accountUser = await accountUserService.findOne({
    AND: [
      {
        key: "user_id",
        operator: "eq",
        value: user.id,
      },
      {
        key: "account_id",
        operator: "eq",
        value: account.id,
      },
    ],
  });

  reply.send({
    ...account,
    role: accountUser?.roleId,
  });
};

export default myAccount;
