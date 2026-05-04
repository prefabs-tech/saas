import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import { formatDate } from "@prefabs.tech/fastify-slonik";

import type { Account, AccountInvitation } from "../../../types";

import isInvitationValid from "../../../lib/isInvitationValid";
import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

const revoke = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, slonik } = request;

  let account: Account | null | undefined = request.account;

  const requestParameters = request.params as {
    accountId: string;
    id: string;
  };

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

  try {
    const service = new AccountInvitationService(
      config,
      slonik,
      accountId,
      dbSchema,
    );
    let accountInvitation = await service.findById(requestParameters.id);

    // is invitation valid
    if (!accountInvitation || !isInvitationValid(accountInvitation)) {
      return reply.status(422).send({
        message: "Invitation is invalid or has expired or already revoked",
        status: "ERROR",
      });
    }

    accountInvitation = await service.update(requestParameters.id, {
      revokedAt: formatDate(new Date(Date.now())),
    });

    const data: Partial<AccountInvitation> = accountInvitation;

    delete data.token;

    reply.send(data);
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default revoke;
