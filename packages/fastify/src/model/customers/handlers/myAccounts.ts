import CustomerUserService from "../../customerUsers/service";
import Service from "../service";

import type { CustomerUser } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const myAccounts = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, slonik, user } = request;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  const customerUserService = new CustomerUserService(config, slonik, dbSchema);
  const customerService = new Service(request.config, request.slonik);

  const customerUsers = await customerUserService.find({
    key: "user_id",
    operator: "eq",
    value: user.id,
  });

  const customers = await customerService.find({
    key: "id",
    operator: "in",
    value: customerUsers
      .map(
        (customerUser) => (customerUser as unknown as CustomerUser).customerId,
      )
      .join(","),
  });

  reply.send(customers);
};

export default myAccounts;
