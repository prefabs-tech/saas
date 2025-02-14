import getSaasConfig from "../../../config";
import isInvitationValid from "../../../lib/isInvitationValid";
import sendInvitation from "../../../lib/sendInvitation";
import CustomerService from "../../customers/service";
import CustomerInvitationService from "../service";

import type {
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { QueryResultRow } from "slonik";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const resend = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, server, slonik } = request;

  let customer: Customer | undefined | null = request.customer;

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

    const customerInvitation = await service.findOne({
      AND: [
        {
          key: "id",
          operator: "eq",
          value: requestParameters.id,
        },
        {
          key: "customer_id",
          operator: "eq",
          value: customer.id,
        },
      ],
    });

    // check if invitation is valid
    if (!customerInvitation || !isInvitationValid(customerInvitation)) {
      return reply.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired",
      });
    }

    let invitationOrigin: string;
    const saasConfig = getSaasConfig(config);

    if (customer.domain) {
      invitationOrigin = `${request.protocol}://${customer.domain}`;
    } else if (customer.slug) {
      invitationOrigin = `${request.protocol}://${customer.slug}.${saasConfig.rootDomain}`;
    } else {
      invitationOrigin = `${request.protocol}://${saasConfig.mainAppSubdomain}.${saasConfig.rootDomain}`;
    }

    try {
      sendInvitation(server, customerInvitation, invitationOrigin);
    } catch (error) {
      log.error(error);
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

export default resend;
