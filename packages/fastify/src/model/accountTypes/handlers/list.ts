import type { FastifyReply, FastifyRequest } from "fastify";

import Service from "../service";

const getAccountTypes = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { config, log, query, slonik } = request;

  try {
    const { filters, limit, offset, sort } = query as {
      filters?: string;
      limit: number;
      offset?: number;
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
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default getAccountTypes;
