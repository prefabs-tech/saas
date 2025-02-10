import CustomerInvitationService from "../service";

import type {
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { QueryResultRow } from "slonik";

const getByToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, customer, dbSchema, log, slonik } = request;

  const requestParameters = request.params as {
    token: string;
    customerId: string;
  };

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

  try {
    const service = new CustomerInvitationService<
      CustomerInvitation & QueryResultRow,
      CustomerInvitationCreateInput,
      CustomerInvitationUpdateInput
    >(config, slonik, dbSchema);

    const customerInvitation = await service.findOne({
      AND: [
        {
          key: "token",
          operator: "eq",
          value: requestParameters.token,
        },
        {
          key: "customer_id",
          operator: "eq",
          value: customerId,
        },
      ],
    });

    reply.send(customerInvitation);
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default getByToken;
