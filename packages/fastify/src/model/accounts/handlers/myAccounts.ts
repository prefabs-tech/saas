import AccountUserService from "../../accountUsers/service";
import Service from "../service";

import type { AccountUser } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccounts = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, slonik, user } = request;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  const accountUserService = new AccountUserService(
    config,
    slonik,
    undefined,
    dbSchema,
  );
  const accountService = new Service(request.config, request.slonik);

  const accountUsers = await accountUserService.find({
    key: "user_id",
    operator: "eq",
    value: user.id,
  });

  const enabledAccountUsers = accountUsers.filter(
    (accountUser) => !(accountUser as AccountUser).disabled,
  );

  const accounts = await accountService.find({
    key: "id",
    operator: "in",
    value: enabledAccountUsers
      .map((accountUser) => (accountUser as unknown as AccountUser).accountId)
      .join(","),
  });

  reply.send(accounts);
};

export default myAccounts;
