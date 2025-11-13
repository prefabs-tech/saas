import AccountInvitationService from "../service";

import type { FastifyReply, FastifyRequest } from "fastify";

const getByToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, account, dbSchema, server, slonik } = request;

  const requestParameters = request.params as {
    token: string;
    accountId: string;
  };

  if (account && account.id != requestParameters.accountId) {
    throw server.httpErrors.badRequest("Account mismatch");
  }

  const accountId = account ? account.id : requestParameters.accountId;

  if (!accountId) {
    throw server.httpErrors.badRequest("Account id is required");
  }

  const service = new AccountInvitationService(
    config,
    slonik,
    accountId,
    dbSchema,
  );

  const accountInvitation = await service.findOneByToken(
    requestParameters.token,
  );

  reply.send(accountInvitation);
};

export default getByToken;
