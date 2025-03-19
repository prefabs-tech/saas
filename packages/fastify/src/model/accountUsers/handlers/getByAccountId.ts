import { QueryResultRow } from "slonik";

import AccountService from "../../accounts/service";
import Service from "../service";

import type {
  Account,
  AccountCreateInput,
  AccountUpdateInput,
} from "../../../types";
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

  const service = new Service(config, slonik, accountId, dbSchema);

  const data = await service.getUsers();

  reply.send(data);
};

export default getUsersByAccountId;
