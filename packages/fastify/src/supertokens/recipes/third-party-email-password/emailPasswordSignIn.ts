import { formatDate } from "@prefabs.tech/fastify-slonik";
import { getUserService } from "@prefabs.tech/fastify-user";

import Email from "../../utils/email";

import type { AuthUser } from "@prefabs.tech/fastify-user";
import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    input.email = Email.addPrefix(
      input.email,
      input.userContext?.authEmailPrefix,
    );

    const originalResponse =
      await originalImplementation.emailPasswordSignIn(input);

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService = getUserService(
      config,
      slonik,
      input.userContext?.dbSchema,
    );

    const user = await userService.findById(originalResponse.user.id);

    if (!user) {
      log.error(`User record not found for userId ${originalResponse.user.id}`);

      return { status: "WRONG_CREDENTIALS_ERROR" };
    }

    user.lastLoginAt = Date.now();

    await userService
      .update(user.id, {
        lastLoginAt: formatDate(new Date(user.lastLoginAt)),
      })
      /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .catch((error: any) => {
        log.error(
          `Unable to update lastLoginAt for userId ${originalResponse.user.id}`,
        );
        log.error(error);
      });

    const authUser: AuthUser = {
      ...originalResponse.user,
      ...user,
    };

    return {
      status: "OK",
      user: authUser,
    };
  };
};

export default emailPasswordSignIn;
