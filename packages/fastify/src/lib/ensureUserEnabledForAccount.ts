import AccountUserService from "../model/accountUsers/service";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

/**
 * PreHandler that blocks access when the session user is disabled for the
 * current account. Use after verifySession() on account-scoped routes.
 * Uses request.account?.database ?? undefined so the check runs in public
 * or the account schema as appropriate.
 */
const ensureUserEnabledForAccount = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const sessionRequest = request as SessionRequest;

  if (!sessionRequest.account || !sessionRequest.user) {
    return;
  }

  const { config, slonik } = sessionRequest;
  const accountId = sessionRequest.account.id;
  const userId = sessionRequest.user.id;
  const dbSchema = sessionRequest.account.database ?? undefined;

  const service = new AccountUserService(config, slonik, accountId, dbSchema);

  const row = await service.findOne({
    AND: [
      { key: "account_id", operator: "eq", value: accountId },
      { key: "user_id", operator: "eq", value: userId },
    ],
  });

  const disabled = row && (row as { disabled?: boolean }).disabled;

  if (!row || disabled) {
    return reply.status(403).send({
      error: "Forbidden",
      message: "User is disabled for this account",
      statusCode: 403,
    });
  }
};

export default ensureUserEnabledForAccount;
