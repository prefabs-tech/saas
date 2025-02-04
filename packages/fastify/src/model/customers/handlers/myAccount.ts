import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccount = async (request: SessionRequest, reply: FastifyReply) => {
  if (!request.customer) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  reply.send(request.customer);
};

export default myAccount;
