import type { User } from "@prefabs.tech/fastify-user";
import type { FastifyReply, FastifyRequest } from "fastify";

import { formatDate } from "@prefabs.tech/fastify-slonik";
import {
  ROLE_USER,
  validateEmail,
  validatePassword,
} from "@prefabs.tech/fastify-user";
import { SessionRequest } from "supertokens-node/framework/fastify";
import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";

import isInvitationValid from "../../../lib/isInvitationValid";
import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

const signup = async (request: SessionRequest, reply: FastifyReply) => {
  const { authEmailPrefix, body, config, log, slonik } =
    request as FastifyRequest<{
      Body: {
        email: string;
        password: string;
      };
    }>;

  const requestParameters = request.params as {
    accountId: string;
    token: string;
  };

  try {
    const email = body?.email ?? "";
    const password = body?.password ?? "";

    //  check if the email is valid
    const emailResult = validateEmail(email, config);

    if (!emailResult.success) {
      return reply.status(422).send({
        message: emailResult.message,
        status: "ERROR",
        statusCode: 422,
      });
    }

    // password strength validation
    const passwordStrength = validatePassword(password, config);

    if (!passwordStrength.success) {
      return reply.status(422).send({
        message: passwordStrength.message,
        status: "ERROR",
        statusCode: 422,
      });
    }

    const accountService = new AccountService(config, slonik);

    const account = await accountService.findById(requestParameters.accountId);

    if (!account) {
      return reply.status(404).send({
        error: "Not Found",
        message: "Account not found",
        statusCode: 404,
      });
    }

    const dbSchema = account.database || undefined;

    const service = new AccountInvitationService(
      config,
      slonik,
      requestParameters.accountId,
      dbSchema,
    );

    const accountInvitation = await service.findOneByToken(
      requestParameters.token,
    );

    // validate the invitation
    if (!accountInvitation || !isInvitationValid(accountInvitation)) {
      return reply.status(422).send({
        message: "Invitation is invalid or has expired",
        status: "ERROR",
        statusCode: 422,
      });
    }

    // compare the FieldInput email to the invitation email
    if (accountInvitation.email != email) {
      return reply.status(422).send({
        message: "Email do not match with the invitation",
        status: "ERROR",
        statusCode: 422,
      });
    }

    // signup
    const signUpResponse = await emailPasswordSignUp(email, password, {
      account: account,
      authEmailPrefix: authEmailPrefix,
      autoVerifyEmail: true,
      dbSchema: dbSchema,
      roles: [config.user.role || ROLE_USER],
      saasAccountRole: accountInvitation.role,
    });

    if (signUpResponse.status !== "OK") {
      return reply.status(422).send({ statusCode: 422, ...signUpResponse });
    }

    // update invitation's acceptedAt value with current time
    await service.update(accountInvitation.id, {
      acceptedAt: formatDate(new Date(Date.now())),
    });

    // run post accept hook
    try {
      await config.saas.invitation?.postAccept?.(
        request as FastifyRequest,
        accountInvitation,
        signUpResponse.user as unknown as User,
      );
    } catch (error) {
      log.error(error);
    }

    // create new session so the user be logged in on signup
    await createNewSession(request, reply, signUpResponse.user.id);

    return reply.send({
      ...signUpResponse,
      user: {
        ...signUpResponse.user,
        roles: [config.user.role || ROLE_USER],
      },
    });
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

export default signup;
