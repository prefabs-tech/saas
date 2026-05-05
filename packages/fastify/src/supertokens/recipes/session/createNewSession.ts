import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

import {
  getUserService,
  ProfileValidationClaim,
} from "@prefabs.tech/fastify-user";
import { getRequestFromUserContext } from "supertokens-node";

import type { Account } from "../../../types";

const createNewSession = (
  originalImplementation: RecipeInterface,

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
          message: "user not found",
          name: "SIGN_IN_FAILED",
          statusCode: 401,
        } as FastifyError;
      }

      if (user?.disabled) {
        throw {
          message: "user is disabled",
          name: "SIGN_IN_FAILED",
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
