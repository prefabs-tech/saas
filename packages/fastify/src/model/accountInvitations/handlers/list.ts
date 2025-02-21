import { QueryResultRow } from "slonik";

import AccountInvitationService from "../service";

import type {
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
} from "../../../types";
import type { FilterInput, PaginatedList } from "@dzangolab/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, account, dbSchema, log, query, slonik } = request;

  const requestParameters = request.params as { accountId: string };

  if (account && account.id != requestParameters.accountId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const accountId = account ? account.id : requestParameters.accountId;

  if (!accountId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  try {
    const { limit, offset, filters, sort } = query as {
      limit: number;
      offset?: number;
      filters?: string;
      sort?: string;
    };

    const accountIdFilter = {
      key: "accountId",
      operator: "eq",
      value: accountId,
    } as FilterInput;

    const combinedFilter = {
      AND: [accountIdFilter, ...(filters ? [filters] : [])],
    } as FilterInput;

    const service = new AccountInvitationService<
      AccountInvitation & QueryResultRow,
      AccountInvitationCreateInput,
      AccountInvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitations = (await service.list(
      limit,
      offset,
      combinedFilter,
      sort ? JSON.parse(sort) : undefined,
    )) as PaginatedList<Partial<AccountInvitation>>;

    for (const invitation of invitations.data) {
      delete invitation.token;
    }

    reply.send(invitations);
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
