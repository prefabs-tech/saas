import { formatDate } from "@dzangolab/fastify-slonik";
import { getUserService } from "@dzangolab/fastify-user";
import { getUsersByEmail } from "supertokens-node/recipe/thirdpartyemailpassword";

import CustomerUserService from "../../../model/customerUsers/service";
import Email from "../../utils/email";

import type { AuthUser } from "@dzangolab/fastify-user";
import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const { dbSchema, customer } = input.userContext;
    let id;

    // added Kludge to allow saas owner to login into customer app.
    if (customer) {
      id = customer.id;
      let users = await getUsersByEmail(input.email);

      // Filter out only email-password recipe users
      users = users.filter((user) => !user.thirdParty);

      if (users.length > 0) {
        const customerUserService = new CustomerUserService(config, slonik);

        if (await customerUserService.isOwner(customer.id, users[0].id)) {
          id = undefined;
        }
      }
    }

    input.email = Email.addIdPrefix(input.email, id);

    const originalResponse =
      await originalImplementation.emailPasswordSignIn(input);

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService = getUserService(config, slonik, dbSchema);

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
