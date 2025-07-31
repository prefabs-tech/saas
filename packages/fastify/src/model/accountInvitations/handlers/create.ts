import {
  computeInvitationExpiresAt,
  getUserService,
  validateEmail,
} from "@prefabs.tech/fastify-user";

import getSaasConfig from "../../../config";
import { ROLE_SAAS_ACCOUNT_MEMBER } from "../../../constants";
import sendInvitation from "../../../lib/sendInvitation";
import AccountService from "../../accounts/service";
import AccountUserService from "../../accountUsers/service";
import AccountInvitationService from "../service";

import type {
  Account,
  AccountInvitation,
  AccountInvitationCreateInput,
} from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, log, server, slonik, user } = request;
  let account: Account | undefined | null = request.account;

  try {
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "unauthorized",
        statusCode: 401,
      });
    }

    const requestParameters = request.params as { accountId: string };

    if (account && account.id != requestParameters.accountId) {
      return reply.status(400).send({
        error: "Bad Request",
        message: "Bad Request",
        statusCode: 400,
      });
    }

    if (!account) {
      const accountService = new AccountService(config, slonik);

      account = await accountService.findById(requestParameters.accountId);
    }

    if (!account) {
      return reply.status(404).send({
        error: "Not Found",
        message: "Account not found",
        statusCode: 404,
      });
    }

    const dbSchema = account.database || undefined;

    const { email, expiresAt, payload, role } =
      body as AccountInvitationCreateInput;

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
      const accountUserService = new AccountUserService(
        config,
        slonik,
        account.id,
        dbSchema,
      );

      const accountUserCount = await accountUserService.count({
        key: "user_id",
        operator: "eq",
        value: invitedUser.id,
      });

      // check if user of the email already exists for the account
      if (accountUserCount > 0) {
        return reply.status(422).send({
          statusCode: 422,
          status: "ERROR",
          message: `User with email ${email} already exists for the account`,
        });
      }
    }

    const service = new AccountInvitationService(
      config,
      slonik,
      account.id,
      dbSchema,
    );

    const invitationCreateInput: AccountInvitationCreateInput = {
      accountId: account.id,
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

    let accountInvitation: AccountInvitation | undefined;

    try {
      accountInvitation = await service.create(invitationCreateInput);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: error.message,
      });
    }

    if (accountInvitation) {
      let invitationOrigin: string;
      const saasConfig = getSaasConfig(config);

      if (account.domain) {
        invitationOrigin = `${request.protocol}://${account.domain}`;
      } else if (account.slug) {
        invitationOrigin = `${request.protocol}://${account.slug}.${saasConfig.rootDomain}`;
      } else {
        invitationOrigin = `${request.protocol}://${saasConfig.mainAppSubdomain}.${saasConfig.rootDomain}`;
      }

      try {
        sendInvitation(server, accountInvitation, invitationOrigin);
      } catch (error) {
        log.error(error);
      }

      const data: Partial<AccountInvitation> = accountInvitation;

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
