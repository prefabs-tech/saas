import {
  computeInvitationExpiresAt,
  getUserService,
  validateEmail,
} from "@dzangolab/fastify-user";
import { QueryResultRow } from "slonik";

import getSaasConfig from "../../../config";
import { ROLE_SAAS_ACCOUNT_MEMBER } from "../../../constants";
import sendInvitation from "../../../lib/sendInvitation";
import CustomerService from "../../customers/service";
import CustomerUserService from "../../customerUsers/service";
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

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, server, slonik, user } = request;
  let customer: Customer | undefined | null = request.customer;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "unauthorized",
        statusCode: 401,
      });
    }

    const requestParameters = request.params as { customerId: string };

    if (customer && customer.id != requestParameters.customerId) {
      return reply.status(400).send({
        error: "Bad Request",
        message: "Bad Request",
        statusCode: 400,
      });
    }

    if (!customer) {
      const customerService = new CustomerService<
        Customer & QueryResultRow,
        CustomerCreateInput,
        CustomerUpdateInput
      >(config, slonik);

      customer = await customerService.findById(requestParameters.customerId);
    }

    if (!customer) {
      return reply.status(404).send({
        error: "Not Found",
        message: "Customer not found",
        statusCode: 404,
      });
    }

    const { email, expiresAt, payload, role } =
      body as CustomerInvitationCreateInput;

    //  check if the email is valid
    const result = validateEmail(email, config);

    if (!result.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: result.message,
      });
    }

    const userService = getUserService(config, slonik, dbSchema);

    const invitedUser = await userService.findOne({
      key: "email",
      operator: "eq",
      value: email,
    });

    if (invitedUser) {
      const customerUserService = new CustomerUserService(
        config,
        slonik,
        dbSchema,
      );

      const customerUserCount = await customerUserService.count({
        AND: [
          {
            key: "user_id",
            operator: "eq",
            value: invitedUser.id,
          },
          {
            key: "customer_id",
            operator: "eq",
            value: customer.id,
          },
        ],
      });

      // check if user of the email already exists for the customer
      if (customerUserCount > 0) {
        return reply.status(422).send({
          statusCode: 422,
          status: "ERROR",
          message: `User with email ${email} already exists for the customer`,
        });
      }
    }

    const service = new CustomerInvitationService<
      CustomerInvitation & QueryResultRow,
      CustomerInvitationCreateInput,
      CustomerInvitationUpdateInput
    >(config, slonik, dbSchema);

    const invitationCreateInput: CustomerInvitationCreateInput = {
      customerId: customer.id,
      email,
      expiresAt: computeInvitationExpiresAt(config, expiresAt),
      invitedById: user.id,
      role: role || ROLE_SAAS_ACCOUNT_MEMBER,
    };

    if (Object.keys(payload || {}).length > 0) {
      invitationCreateInput.payload = JSON.stringify(payload);
    }

    if (invitedUser) {
      invitationCreateInput.userId = invitedUser.id;
    }

    let customerInvitation: CustomerInvitation | undefined;

    try {
      customerInvitation = await service.create(invitationCreateInput);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: error.message,
      });
    }

    if (customerInvitation) {
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
    }
  } catch (error) {
    log.error(error);

    reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default create;
