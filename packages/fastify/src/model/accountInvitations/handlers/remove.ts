import { QueryResultRow } from "slonik";

import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type {
  Account,
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const remove = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, slonik } = request;

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

    const accountInvitation = await service.delete(requestParameters.id);

    if (!accountInvitation) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: "Invitation not found",
      });
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

export default remove;
