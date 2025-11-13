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

import type { User } from "@prefabs.tech/fastify-user";
import type { FastifyReply, FastifyRequest } from "fastify";

const signup = async (request: SessionRequest, reply: FastifyReply) => {
  const { authEmailPrefix, body, config, log, server, slonik } =
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

  const email = body?.email ?? "";
  const password = body?.password ?? "";

  //  check if the email is valid
  const emailResult = validateEmail(email, config);

  if (!emailResult.success) {
    throw server.httpErrors.unprocessableEntity(
      emailResult.message || "Invalid email",
    );
  }

  // password strength validation
  const passwordStrength = validatePassword(password, config);

  if (!passwordStrength.success) {
    throw server.httpErrors.unprocessableEntity(
      passwordStrength.message || "Invalid password",
    );
  }

  const accountService = new AccountService(config, slonik);

  const account = await accountService.findById(requestParameters.accountId);

  if (!account) {
    throw server.httpErrors.notFound("Account not found");
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
    throw server.httpErrors.unprocessableEntity(
      "Invitation is invalid or has expired",
    );
  }

  // compare the FieldInput email to the invitation email
  if (accountInvitation.email != email) {
    throw server.httpErrors.unprocessableEntity(
      "Email do not match with the invitation",
    );
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
    throw server.httpErrors.unprocessableEntity(signUpResponse.status);
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
};

export default signup;
