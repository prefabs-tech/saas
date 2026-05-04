import type { User } from "@prefabs.tech/fastify-user";
import type { FastifyReply, FastifyRequest } from "fastify";

import { formatDate } from "@prefabs.tech/fastify-slonik";
import { SessionRequest } from "supertokens-node/framework/fastify";

import isInvitationValid from "../../../lib/isInvitationValid";
import AccountService from "../../accounts/service";
import AccountUserService from "../../accountUsers/service";
import AccountInvitationService from "../service";

const join = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, log, slonik, user } = request;

  const requestParameters = request.params as {
    accountId: string;
    token: string;
  };

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  try {
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
    if (accountInvitation.userId != user.id) {
      return reply.status(422).send({
        message: "User do not match with the invitation",
        status: "ERROR",
        statusCode: 422,
      });
    }

    const accountUserService = new AccountUserService(
      config,
      slonik,
      account.id,
      dbSchema,
    );

    await accountUserService.create({
      accountId: account.id,
      roleId: accountInvitation.role,
      userId: user.id,
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

export default join;
