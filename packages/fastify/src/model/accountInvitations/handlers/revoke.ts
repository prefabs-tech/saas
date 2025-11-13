import { formatDate } from "@prefabs.tech/fastify-slonik";

import isInvitationValid from "../../../lib/isInvitationValid";
import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type { Account, AccountInvitation } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const revoke = async (request: SessionRequest, reply: FastifyReply) => {
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
  let accountInvitation = await service.findById(requestParameters.id);

  // is invitation valid
  if (!accountInvitation || !isInvitationValid(accountInvitation)) {
    throw server.httpErrors.unprocessableEntity(
      "Invitation is invalid or has expired or already revoked",
    );
  }

  accountInvitation = await service.update(requestParameters.id, {
    revokedAt: formatDate(new Date(Date.now())),
  });

  const data: Partial<AccountInvitation> = accountInvitation;

  delete data.token;

  reply.send(data);
};

export default revoke;
