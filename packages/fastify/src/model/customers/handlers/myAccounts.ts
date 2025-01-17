import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccounts = async (request: SessionRequest, reply: FastifyReply) => {
  const user = request.user;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  const service = new Service(request.config, request.slonik);

  const data = await service.findByUserId(user.id);

  reply.send(data);
};

export default myAccounts;
