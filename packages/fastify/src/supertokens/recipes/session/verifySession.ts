import type { FastifyError, FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/session/types";

const verifySession = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance,
): APIInterface["verifySession"] => {
  return async (input) => {
    if (originalImplementation.verifySession === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse = await originalImplementation.verifySession(input);

    if (originalResponse) {
      const request = input.userContext._default.request.request;
      const user = request.user;

      // The account comes from a header the caller sets, and one auth core
      // makes the sessions for all accounts. `user` is read from the schema of
      // the resolved account. An absent user is a session from a different
      // account. The session stays valid for its own account, so it is not
      // revoked here.
      if (request.dbSchema && !user) {
        throw {
          message: "user not found",
          name: "SESSION_VERIFICATION_FAILED",
          statusCode: 401,
        } as FastifyError;
      }

      if (user?.deletedAt) {
        await originalResponse.revokeSession();

        throw {
          message: "user not found",
          name: "SESSION_VERIFICATION_FAILED",
          statusCode: 401,
        } as FastifyError;
      }

      if (user?.disabled) {
        await originalResponse.revokeSession();

        throw {
          message: "user is disabled",
          name: "SESSION_VERIFICATION_FAILED",
          statusCode: 401,
        } as FastifyError;
      }
    }

    return originalResponse;
  };
};

export default verifySession;
