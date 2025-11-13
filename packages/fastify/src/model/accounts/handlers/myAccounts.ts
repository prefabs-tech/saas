import AccountUserService from "../../accountUsers/service";
import Service from "../service";

import type { AccountUser } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccounts = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, server, slonik, user } = request;

  if (!user) {
    throw server.httpErrors.unauthorized("Unauthorised");
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

  const accounts = await accountService.find({
    key: "id",
    operator: "in",
    value: accountUsers
      .map((accountUser) => (accountUser as unknown as AccountUser).accountId)
      .join(","),
  });

  reply.send(accounts);
};

export default myAccounts;
