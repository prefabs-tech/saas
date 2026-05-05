import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import type { Account } from "../../../types";

import AccountService from "../../accounts/service";
import Service from "../service";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, query, slonik } = request;

  let account: Account | null | undefined = request.account;

  const requestParameters = request.params as { accountId: string };

  if (account && account.id != requestParameters.accountId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const accountId = account ? account.id : requestParameters.accountId;

  if (!account) {
    const accountService = new AccountService(config, slonik);

    account = await accountService.findById(accountId);
  }

  if (!account) {
    return reply.status(404).send({
      error: "Not Found",
      message: "Account not found",
      statusCode: 404,
    });
  }

  const dbSchema = account.database || undefined;

  const { filters, limit, offset, sort } = query as {
    filters?: string;
    limit: number;
    offset?: number;
    sort?: string;
  };

  const service = new Service(config, slonik, accountId, dbSchema);

  const data = await service.list(
    limit,
    offset,
    filters ? JSON.parse(filters) : undefined,
    sort ? JSON.parse(sort) : undefined,
  );

  reply.send(data);
};

export default list;
