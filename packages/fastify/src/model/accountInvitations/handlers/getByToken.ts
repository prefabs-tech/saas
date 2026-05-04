import type { FastifyReply, FastifyRequest } from "fastify";

import AccountInvitationService from "../service";

const getByToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { account, config, dbSchema, log, slonik } = request;

  const requestParameters = request.params as {
    accountId: string;
    token: string;
  };

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
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default getByToken;
