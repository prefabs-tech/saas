import getSaasConfig from "../../../config";
import isInvitationValid from "../../../lib/isInvitationValid";
import sendInvitation from "../../../lib/sendInvitation";
import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type {
  Account,
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const resend = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, server, slonik } = request;

  let account: Account | undefined | null = request.account;

  const requestParameters = request.params as {
    id: string;
    accountId: string;
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
    const service = new AccountInvitationService<
      AccountInvitation & QueryResultRow,
      AccountInvitationCreateInput,
      AccountInvitationUpdateInput
    >(config, slonik, accountId, dbSchema);

    const accountInvitation = await service.findById(requestParameters.id);

    // check if invitation is valid
    if (!accountInvitation || !isInvitationValid(accountInvitation)) {
      return reply.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired",
      });
    }

    let invitationOrigin: string;
    const saasConfig = getSaasConfig(config);

    if (account.domain) {
      invitationOrigin = `${request.protocol}://${account.domain}`;
    } else if (account.slug) {
      invitationOrigin = `${request.protocol}://${account.slug}.${saasConfig.rootDomain}`;
    } else {
      invitationOrigin = `${request.protocol}://${saasConfig.mainAppSubdomain}.${saasConfig.rootDomain}`;
    }

    try {
      sendInvitation(server, accountInvitation, invitationOrigin);
    } catch (error) {
      log.error(error);
    }

    const data: Partial<AccountInvitation> = accountInvitation;

    delete data.token;

    reply.send(data);
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default resend;
