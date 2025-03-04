import Service from "../service";

import type { AccountTypeUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const update = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const input = request.body as AccountTypeUpdateInput;

  const data = await service.updateWithI18ns(id, input);

  reply.send(data);
};

export default update;
