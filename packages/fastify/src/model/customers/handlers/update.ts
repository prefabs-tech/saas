import Service from "../service";

import type { CustomerUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const update = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const input = request.body as CustomerUpdateInput;

  const data = await service.update(id, input);

  reply.send(data);
};

export default update;
