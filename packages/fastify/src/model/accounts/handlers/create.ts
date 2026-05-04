import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import { AccountCreateInput } from "../../../types";
import Service from "../service";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);
  const input = request.body as AccountCreateInput;

  const data = await service.create(input);

  reply.send(data);
};

export default create;
