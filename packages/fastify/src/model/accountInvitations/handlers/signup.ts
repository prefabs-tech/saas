import { formatDate } from "@dzangolab/fastify-slonik";
import {
  ROLE_USER,
  validateEmail,
  validatePassword,
} from "@dzangolab/fastify-user";
import { QueryResultRow } from "slonik";
import { SessionRequest } from "supertokens-node/framework/fastify";
import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";

import isInvitationValid from "../../../lib/isInvitationValid";
import AccountService from "../../accounts/service";
import AccountInvitationService from "../service";

import type {
  Account,
  AccountCreateInput,
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
  AccountUpdateInput,
} from "../../../types";
import type { User } from "@dzangolab/fastify-user";
import type { FastifyReply, FastifyRequest } from "fastify";

const accept = async (request: SessionRequest, reply: FastifyReply) => {
  const { authEmailPrefix, body, config, log, slonik } =
    request as FastifyRequest<{
      Body: {
        email: string;
        password: string;
      };
    }>;

  const requestParameters = request.params as {
    token: string;
    accountId: string;
  };

  try {
    const email = body?.email ?? "";
    const password = body?.password ?? "";

    //  check if the email is valid
    const emailResult = validateEmail(email, config);

    if (!emailResult.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: emailResult.message,
      });
    }

    // password strength validation
    const passwordStrength = validatePassword(password, config);

    if (!passwordStrength.success) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: passwordStrength.message,
      });
    }

    const accountService = new AccountService<
      Account & QueryResultRow,
      AccountCreateInput,
      AccountUpdateInput
    >(config, slonik);

    const account = await accountService.findById(requestParameters.accountId);

    if (!account) {
      return reply.status(404).send({
        error: "Not Found",
        message: "Account not found",
        statusCode: 404,
      });
    }

    const dbSchema = account.database || undefined;

    const service = new AccountInvitationService<
      AccountInvitation & QueryResultRow,
      AccountInvitationCreateInput,
      AccountInvitationUpdateInput
    >(config, slonik, requestParameters.accountId, dbSchema);

    const accountInvitation = await service.findOneByToken(
      requestParameters.token,
    );

    // validate the invitation
    if (!accountInvitation || !isInvitationValid(accountInvitation)) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: "Invitation is invalid or has expired",
      });
    }

    // compare the FieldInput email to the invitation email
    if (accountInvitation.email != email) {
      return reply.status(422).send({
        statusCode: 422,
        status: "ERROR",
        message: "Email do not match with the invitation",
      });
    }

    // signup
    const signUpResponse = await emailPasswordSignUp(email, password, {
      roles: [config.user.role || ROLE_USER],
      saasAccountRole: accountInvitation.role,
      autoVerifyEmail: true,
      account: account,
      dbSchema: dbSchema,
      authEmailPrefix: authEmailPrefix,
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
      statusCode: 500,
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default accept;
