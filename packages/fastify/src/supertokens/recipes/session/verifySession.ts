import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
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
      const request = input.userContext._default.request
        .request as FastifyRequest;

      const customer = request.customer;
      const payloadCusotmerId =
        originalResponse.getAccessTokenPayload().customerId;

      if (customer && customer.id != payloadCusotmerId) {
        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "invalid session",
          statusCode: 401,
        } as FastifyError;
      }

      const user = input.userContext._default.request.request.user;

      if (user?.disabled) {
        await originalResponse.revokeSession();

        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "user is disabled",
          statusCode: 401,
        } as FastifyError;
      }
    }

    return originalResponse;
  };
};

export default verifySession;
