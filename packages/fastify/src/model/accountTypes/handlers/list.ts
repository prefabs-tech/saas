import Service from "../service";

import type { FastifyRequest, FastifyReply } from "fastify";

const getAccountTypes = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { config, log, query, slonik } = request;

  try {
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
