import { QueryResultRow } from "slonik";

import CustomerInvitationService from "../service";

import type {
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
} from "../../../types";
import type { FilterInput, PaginatedList } from "@dzangolab/fastify-slonik";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const list = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, customer, dbSchema, log, query, slonik } = request;

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

  try {
    const { limit, offset, filters, sort } = query as {
      limit: number;
      offset?: number;
      filters?: string;
      sort?: string;
    };

    const customerIdFilter = {
      key: "customerId",
      operator: "eq",
      value: customerId,
    } as FilterInput;

    const combinedFilter = {
      AND: [customerIdFilter, ...(filters ? [filters] : [])],
    } as FilterInput;

    const service = new CustomerInvitationService<
      CustomerInvitation & QueryResultRow,
      CustomerInvitationCreateInput,
      CustomerInvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitations = (await service.list(
      limit,
      offset,
      combinedFilter,
      sort ? JSON.parse(sort) : undefined,
    )) as PaginatedList<Partial<CustomerInvitation>>;

    for (const invitation of invitations.data) {
      delete invitation.token;
    }

    reply.send(invitations);
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
