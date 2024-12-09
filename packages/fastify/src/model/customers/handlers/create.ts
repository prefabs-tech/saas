import { CustomerUpdateInput } from "../../../types";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);
  const input = request.body as CustomerUpdateInput;

  const data = await service.create(input);

  reply.send(data);
};

export default create;
