import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type { Account, AccountInvitation } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const remove = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, server, slonik } = request;

  let account: Account | undefined | null = request.account;

  const requestParameters = request.params as {
    id: string;
    accountId: string;
  };

  if (account && account.id != requestParameters.accountId) {
    throw server.httpErrors.badRequest("Account mismatch");
  }

  const accountId = account ? account.id : requestParameters.accountId;

  if (!account) {
    const accountService = new AccountService(config, slonik);

    account = await accountService.findById(accountId);
  }

  if (!account) {
    throw server.httpErrors.notFound("Account not found");
  }

  const dbSchema = account.database || undefined;

  const service = new AccountInvitationService(
    config,
    slonik,
    accountId,
    dbSchema,
  );

  const accountInvitation = await service.delete(requestParameters.id);

  if (!accountInvitation) {
    throw server.httpErrors.unprocessableEntity("Invitation not found");
  }

  const data: Partial<AccountInvitation> = accountInvitation;

  delete data.token;

  reply.send(data);
};

export default remove;
