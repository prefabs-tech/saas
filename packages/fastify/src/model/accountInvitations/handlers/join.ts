import { formatDate } from "@prefabs.tech/fastify-slonik";
import { SessionRequest } from "supertokens-node/framework/fastify";

import isInvitationValid from "../../../lib/isInvitationValid";
import AccountService from "../../accounts/service";
import AccountUserService from "../../accountUsers/service";
import AccountInvitationService from "../service";

import type { User } from "@prefabs.tech/fastify-user";
import type { FastifyReply, FastifyRequest } from "fastify";

const join = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, server, slonik, user } = request;

  const requestParameters = request.params as {
    token: string;
    accountId: string;
  };

  if (!user) {
    throw server.httpErrors.unauthorized("Unauthorised");
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
  if (accountInvitation.userId != user.id) {
    throw server.httpErrors.unprocessableEntity(
      "User do not match with the invitation",
    );
  }

  const accountUserService = new AccountUserService(
    config,
    slonik,
    account.id,
    dbSchema,
  );

  await accountUserService.create({
    accountId: account.id,
    userId: user.id,
    roleId: accountInvitation.role,
  });

  // update invitation's acceptedAt value with current time
  await service.update(accountInvitation.id, {
    acceptedAt: formatDate(new Date(Date.now())),
  });

  // run post accept hook
  try {
    await config.saas.invitation?.postAccept?.(
      request as FastifyRequest,
      accountInvitation,
      request.user as unknown as User,
    );
  } catch (error) {
    log.error(error);
  }

  reply.send({
    message: `User joined "${account.name}" account successfully`,
  });
};

export default join;
