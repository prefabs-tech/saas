import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const enableAccountUser = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  if (!request.account) {
    return reply.status(404).send({
      error: "Not Found",
      message: "Account not found",
      statusCode: 404,
    });
  }

  const requestParameters = request.params as {
    accountId: string;
    userId: string;
  };

  if (request.account.id !== requestParameters.accountId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const { config, slonik } = request;
  const accountId = request.account.id;
  const userId = requestParameters.userId;
  const dbSchema = request.account.database ?? undefined;

  const service = new Service(config, slonik, accountId, dbSchema);

  const accountUser = await service.findOne({
    AND: [
      { key: "account_id", operator: "eq", value: accountId },
      { key: "user_id", operator: "eq", value: userId },
    ],
  });

  if (!accountUser) {
    return reply.status(404).send({
      error: "Not Found",
      message: "Account user not found",
      statusCode: 404,
    });
  }

  const data = await service.update((accountUser as { id: number }).id, {
    disabled: false,
  });

  reply.send(data);
};

export default enableAccountUser;
