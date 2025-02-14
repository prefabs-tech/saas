import { QueryResultRow } from "slonik";

import CustomerService from "../../customers/service";
import CustomerInvitationService from "../service";

import type {
  Customer,
  CustomerCreateInput,
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
  CustomerUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, slonik } = request;

  let customer: Customer | undefined | null = request.customer;

  const requestParameters = request.params as { customerId: string };

  if (customer && customer.id != requestParameters.customerId) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Bad Request",
      statusCode: 400,
    });
  }

  const customerId = customer ? customer.id : requestParameters.customerId;

  if (!customer) {
    const customerService = new CustomerService<
      Customer & QueryResultRow,
      CustomerCreateInput,
      CustomerUpdateInput
    >(config, slonik);

    customer = await customerService.findById(customerId);
  }

  if (!customer) {
    return reply.status(404).send({
      error: "Not Found",
      message: "Customer not found",
      statusCode: 404,
    });
  }

  const dbSchema = customer.database || undefined;

  try {
    const service = new CustomerInvitationService<
      CustomerInvitation & QueryResultRow,
      CustomerInvitationCreateInput,
      CustomerInvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitations = await service.find({
      key: "customerId",
      operator: "eq",
      value: customerId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitizedInvitations = invitations.map(({ token, ...rest }) => rest);

    reply.send(sanitizedInvitations);
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default list;
