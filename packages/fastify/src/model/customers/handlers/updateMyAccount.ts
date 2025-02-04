import Service from "../service";

import type { CustomerUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateMyAccount = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const { config, customer, slonik } = request;
  const service = new Service(config, slonik);

  if (!customer) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const input = request.body as CustomerUpdateInput;

  const data = await service.update(customer.id, input);

  reply.send(data);
};

export default updateMyAccount;
