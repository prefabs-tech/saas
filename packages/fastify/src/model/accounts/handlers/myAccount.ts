import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccount = async (request: SessionRequest, reply: FastifyReply) => {
  if (!request.account) {
    throw request.server.httpErrors.badRequest("Account not found");
  }

  reply.send(request.account);
};

export default myAccount;
