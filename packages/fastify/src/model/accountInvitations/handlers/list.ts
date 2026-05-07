import type { PaginatedList } from "@prefabs.tech/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import type { AccountInvitation } from "../../../types";

import AccountInvitationService from "../service";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { account, config, dbSchema, log, query, slonik } = request;

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
    const { filters, limit, offset, sort } = query as {
      filters?: string;
      limit: number;
      offset?: number;
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
