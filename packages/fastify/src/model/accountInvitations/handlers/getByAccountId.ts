import { QueryResultRow } from "slonik";

import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type {
  Account,
  AccountCreateInput,
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
  AccountUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, slonik } = request;

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
    const accountService = new AccountService<
      Account & QueryResultRow,
      AccountCreateInput,
      AccountUpdateInput
    >(config, slonik);

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

    const invitations = await service.find({
      key: "accountId",
      operator: "eq",
      value: accountId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitizedInvitations = invitations.map(({ token, ...rest }) => rest);

    reply.send(sanitizedInvitations);
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default list;
