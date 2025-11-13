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
    throw request.server.httpErrors.badRequest("Account mismatch");
  }

  const accountId = account ? account.id : requestParameters.accountId;

  if (!account) {
    const accountService = new AccountService(config, slonik);

    account = await accountService.findById(accountId);
  }

  if (!account) {
    throw request.server.httpErrors.notFound("Account not found");
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
