import {
  computeInvitationExpiresAt,
  getUserService,
  validateEmail,
} from "@dzangolab/fastify-user";
import { QueryResultRow } from "slonik";

import getSaasConfig from "../../../config";
import { ROLE_SAAS_ACCOUNT_MEMBER } from "../../../constants";
import sendInvitation from "../../../lib/sendInvitation";
import CustomerUserService from "../../customerUsers/service";
import CustomerInvitationService from "../service";

import type {
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, customer, dbSchema, log, server, slonik, user } =
    request;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "unauthorized",
        statusCode: 401,
      });
    }

    const parameters = request.params as { customerId: string };
    const customerId = customer ? customer.id : parameters.customerId;

    if (!customerId) {
      return reply.status(400).send({
        error: "Bad Request",
        message: "Bad Request",
        statusCode: 400,
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

    const InvitedUser = await userService.findOne({
      key: "email",
      operator: "eq",
      value: email,
    });

    if (InvitedUser) {
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
            value: InvitedUser.id,
          },
          {
            key: "customer_id",
            operator: "eq",
            value: customerId,
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
      customerId,
      email,
      expiresAt: computeInvitationExpiresAt(config, expiresAt),
      invitedById: user.id,
      role: role || ROLE_SAAS_ACCOUNT_MEMBER,
    };

    if (Object.keys(payload || {}).length > 0) {
      invitationCreateInput.payload = JSON.stringify(payload);
    }

    let customerInvitation: CustomerInvitation | undefined;

    try {
      customerInvitation = await service.create(invitationCreateInput);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: error.message,
      });
    }

    if (customerInvitation) {
      // FIXME: the app origin should be according to customer record.
      const saasConfig = getSaasConfig(config);

      const origin = `${saasConfig.mainAppSubdomain}.${saasConfig.rootDomain}`;

      try {
        sendInvitation(server, customerInvitation, origin);
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
