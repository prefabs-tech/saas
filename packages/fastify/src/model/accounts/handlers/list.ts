import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import Service from "../service";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { filters, limit, offset, sort } = request.query as {
    filters?: string;
    limit: number;
    offset?: number;
    sort?: string;
  };

  const data = await service.list(
    limit,
    offset,
    filters ? JSON.parse(filters) : undefined,
    sort ? JSON.parse(sort) : undefined,
  );

  reply.send(data);
};

export default list;
