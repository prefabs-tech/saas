import {
  getUserService,
  ProfileValidationClaim,
} from "@prefabs.tech/fastify-user";
import { getRequestFromUserContext } from "supertokens-node";

import type { Account } from "../../../types";
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const createNewSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance,
): RecipeInterface["createNewSession"] => {
  return async (input) => {
    if (originalImplementation.createNewSession === undefined) {
      throw new Error("Should never come here");
    }

    const request = getRequestFromUserContext(input.userContext)?.original as
      | FastifyRequest
      | undefined;

    const account = (input.userContext?.account || request?.account) as
      | Account
      | undefined;

    const { config, slonik } = fastify;

    if (request && !request?.user) {
      const userService = getUserService(
        config,
        slonik,
        account?.database as string,
      );

      const user = (await userService.findById(input.userId)) || undefined;

      if (user?.deletedAt) {
        throw {
          name: "SIGN_IN_FAILED",
          message: "user not found",
          statusCode: 401,
        } as FastifyError;
      }

      if (user?.disabled) {
        throw {
          name: "SIGN_IN_FAILED",
          message: "user is disabled",
          statusCode: 401,
        } as FastifyError;
      }

      input.userContext._default.request.request.user = user;
    }

    const session = await originalImplementation.createNewSession(input);

    if (request && request.config.user.features?.profileValidation?.enabled) {
      await session.fetchAndSetClaim(
        new ProfileValidationClaim(),
        input.userContext,
      );
    }

    return session;
  };
};

export default createNewSession;
