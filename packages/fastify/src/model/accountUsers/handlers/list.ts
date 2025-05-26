import AccountService from "../../accounts/service";
import Service from "../service";

import type { Account } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, slonik, query } = request;

  let account: Account | undefined | null = request.account;

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

  const { limit, offset, filters, sort } = query as {
    limit: number;
    offset?: number;
    filters?: string;
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
