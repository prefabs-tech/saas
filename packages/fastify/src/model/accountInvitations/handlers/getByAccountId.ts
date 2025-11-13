import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type { Account } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, server, slonik } = request;

  let account: Account | undefined | null = request.account;

  const requestParameters = request.params as { accountId: string };

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

  const invitations = await service.find({
    key: "accountId",
    operator: "eq",
    value: accountId,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sanitizedInvitations = invitations.map(({ token, ...rest }) => rest);

  reply.send(sanitizedInvitations);
};

export default list;
