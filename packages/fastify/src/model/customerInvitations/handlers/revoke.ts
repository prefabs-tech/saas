import { formatDate } from "@dzangolab/fastify-slonik";
import { QueryResultRow } from "slonik";

import isInvitationValid from "../../../lib/isInvitationValid";
import CustomerInvitationService from "../service";

import type {
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const revoke = async (request: SessionRequest, reply: FastifyReply) => {
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
    let customerInvitation = await service.findOne({
      AND: [
        {
          key: "id",
          operator: "eq",
          value: requestParameters.id,
        },
        {
          key: "customer_id",
          operator: "eq",
          value: customerId,
        },
      ],
    });

    // is invitation valid
    if (!customerInvitation || !isInvitationValid(customerInvitation)) {
      return reply.status(422).send({
        status: "ERROR",
        message: "Invitation is invalid or has expired or already revoked",
      });
    }

    customerInvitation = await service.update(requestParameters.id, {
      revokedAt: formatDate(new Date(Date.now())),
    });

    const data: Partial<CustomerInvitation> = customerInvitation;

    delete data.token;

    reply.send(data);
  } catch (error) {
    log.error(error);
    reply.status(500);

    reply.send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default revoke;
