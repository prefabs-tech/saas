import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import type { AccountTypeUpdateInput } from "../../../types";

import Service from "../service";

const update = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const input = request.body as AccountTypeUpdateInput;

  const data = await service.updateWithI18ns(id, input);

  reply.send(data);
};

export default update;
