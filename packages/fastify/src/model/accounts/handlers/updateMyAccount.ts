import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import type { AccountUpdateInput } from "../../../types";

import Service from "../service";

const updateMyAccount = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const { account, config, slonik } = request;
  const service = new Service(config, slonik);

  if (!account) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const input = request.body as AccountUpdateInput;

  const data = await service.update(account.id, input);

  reply.send(data);
};

export default updateMyAccount;
