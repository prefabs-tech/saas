import AccountService from "../../accounts/service";
import Service from "../service";

import type { Account } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getUsersByAccountId = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const { config, slonik } = request;

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

  const service = new Service(config, slonik, accountId, dbSchema);

  const data = await service.getUsers();

  reply.send(data);
};

export default getUsersByAccountId;
