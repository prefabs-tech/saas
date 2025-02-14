import { QueryResultRow } from "slonik";

import CustomerService from "../../customers/service";
import Service from "../service";

import type {
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getUsersByCustomerId = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const { config, slonik } = request;

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

  const service = new Service(config, slonik, dbSchema);

  const data = await service.getUsersByCustomerId(requestParameters.customerId);

  reply.send(data);
};

export default getUsersByCustomerId;
