import Service from "../service";

import type { FastifyRequest, FastifyReply } from "fastify";

const getAccountTypes = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { config, slonik } = request;

  const service = new Service(config, slonik);

  const data = await service.all(["id", "forOrganization", "forIndividual"]);

  reply.send(data);
};

export default getAccountTypes;
