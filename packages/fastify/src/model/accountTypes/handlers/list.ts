import Service from "../service";

import type { FastifyRequest, FastifyReply } from "fastify";

const getAccountTypes = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { config, query, slonik } = request;

  const { limit, offset, filters, sort } = query as {
    limit: number;
    offset?: number;
    filters?: string;
    sort?: string;
  };

  const service = new Service(config, slonik);

  const data = await service.list(
    limit,
    offset,
    filters ? JSON.parse(filters) : undefined,
    sort ? JSON.parse(sort) : undefined,
  );

  reply.send(data);
};

export default getAccountTypes;
