import type { User } from "@prefabs.tech/fastify-user";
import type { FastifyError, FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

import {
  areRolesExist,
  formatDate,
  getUserService,
} from "@prefabs.tech/fastify-user";
import { deleteUser } from "supertokens-node";
import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import type { Account } from "../../../types";

import { ROLE_SAAS_ACCOUNT_MEMBER } from "../../../constants";
import AccountUserService from "../../../model/accountUsers/service";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const roles = (input.userContext?.roles || []) as string[];
    const account: Account | undefined = input.userContext?.account;
    const authEmailPrefix: boolean = input.userContext?.authEmailPrefix;

    input.thirdPartyUserId = authEmailPrefix + input.thirdPartyUserId;

    const thirdPartyUser = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext,
    );

    if (!thirdPartyUser && config.user.features?.signUp?.enabled === false) {
      throw {
        message: "SignUp feature is currently disabled",
        name: "SIGN_UP_DISABLED",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUp(input);

    const userService = getUserService(
      config,
      slonik,
      input.userContext?.dbSchema,
    );

    if (originalResponse.createdNewUser) {
      if (!(await areRolesExist(roles))) {
        await deleteUser(originalResponse.user.id);

        log.error(`At least one role from ${roles.join(", ")} does not exist.`);

        throw {
          message: "Something went wrong",
          name: "SIGN_UP_FAILED",
          statusCode: 500,
        } as FastifyError;
      }

      for (const role of roles) {
        const rolesResponse = await UserRoles.addRoleToUser(
          originalResponse.user.id,
          role,
        );

        if (rolesResponse.status !== "OK") {
          log.error(rolesResponse.status);
        }
      }

      let user: null | undefined | User;

      try {
        user = await userService.create({
          email: originalResponse.user.email,
          id: originalResponse.user.id,
        });

        if (!user) {
          throw new Error("User not found");
        }
        /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        log.error("Error while creating user");
        log.error(error);

        await deleteUser(originalResponse.user.id);

        throw {
          message: "Something went wrong",
          name: "SIGN_UP_FAILED",
          statusCode: 500,
        };
      }

      if (account) {
        const accountUserService = new AccountUserService(
          config,
          slonik,
          account.id,
          input.userContext?.dbSchema,
        );

        await accountUserService.create({
          accountId: account.id,
          roleId: ROLE_SAAS_ACCOUNT_MEMBER,
          userId: originalResponse.user.id,
        });
      }
    } else {
      await userService
        .update(originalResponse.user.id, {
          lastLoginAt: formatDate(new Date(Date.now())),
        })
        /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .catch((error: any) => {
          log.error(
            `Unable to update lastLoginAt for userId ${originalResponse.user.id}`,
          );
          log.error(error);
        });
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
