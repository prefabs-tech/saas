import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getUsersByCustomerId = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const { config, customer, dbSchema, slonik } = request;

  const requestParameters = request.params as { customerId: string };

  if (customer && customer.id != requestParameters.customerId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const customerId = customer ? customer.id : requestParameters.customerId;

  if (!customerId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const service = new Service(config, slonik, dbSchema);

  const data = await service.getUsersByCustomerId(requestParameters.customerId);

  reply.send(data);
};

export default getUsersByCustomerId;
