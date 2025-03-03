import { AccountTypeCreateInput } from "../../../types";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);
  const input = request.body as AccountTypeCreateInput;

  const data = await service.createWithI18ns(input);

  reply.send(data);
};

export default create;
