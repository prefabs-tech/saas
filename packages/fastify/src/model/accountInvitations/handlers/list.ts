import AccountInvitationService from "../service";

import type { AccountInvitation } from "../../../types";
import type { PaginatedList } from "@prefabs.tech/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, account, dbSchema, query, server, slonik } = request;

  const requestParameters = request.params as { accountId: string };

  if (account && account.id != requestParameters.accountId) {
    throw server.httpErrors.badRequest("Account mismatch");
  }

  const accountId = account ? account.id : requestParameters.accountId;

  if (!accountId) {
    throw server.httpErrors.badRequest("Account id is required");
  }

  const { limit, offset, filters, sort } = query as {
    limit: number;
    offset?: number;
    filters?: string;
    sort?: string;
  };

  const service = new AccountInvitationService(
    config,
    slonik,
    accountId,
    dbSchema,
  );

  const invitations = (await service.list(
    limit,
    offset,
    filters ? JSON.parse(filters) : undefined,
    sort ? JSON.parse(sort) : undefined,
  )) as PaginatedList<Partial<AccountInvitation>>;

  for (const invitation of invitations.data) {
    delete invitation.token;
  }

  reply.send(invitations);
};

export default list;
