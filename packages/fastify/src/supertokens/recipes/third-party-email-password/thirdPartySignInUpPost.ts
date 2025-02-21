import { getUserService, ROLE_USER } from "@dzangolab/fastify-user";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance,
): APIInterface["thirdPartySignInUpPOST"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const request = input.options.req.original as FastifyRequest;

    input.userContext.roles = [fastify.config.user.role || ROLE_USER];

    input.userContext.account = request.account;
    input.userContext.dbSchema = request.dbSchema;
    input.userContext.authEmailPrefix = request.authEmailPrefix;

    if (originalImplementation.thirdPartySignInUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUpPOST(input);

    if (originalResponse.status === "OK") {
      const userService = getUserService(config, slonik, request.dbSchema);

      const user = await userService.findById(originalResponse.user.id);

      if (!user) {
        log.error(
          `User record not found for userId ${originalResponse.user.id}`,
        );

        return {
          status: "GENERAL_ERROR",
          message: "Something went wrong",
        };
      }

      return {
        ...originalResponse,
        user: {
          ...originalResponse.user,
          ...user,
        },
      };
    }

    return originalResponse;
  };
};

export default thirdPartySignInUpPOST;
