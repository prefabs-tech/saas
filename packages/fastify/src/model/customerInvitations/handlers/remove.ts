import { QueryResultRow } from "slonik";

import CustomerInvitationService from "../service";

import type {
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const remove = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, customer, dbSchema, log, slonik } = request;

  const requestParameters = request.params as {
    id: string;
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

    const customerInvitation = await service.deleteByIdAndCustomerId(
      requestParameters.id,
      customerId,
    );

    if (!customerInvitation) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: "Invitation not found",
      });
    }

    const data: Partial<CustomerInvitation> = customerInvitation;

    delete data.token;

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

export default remove;
