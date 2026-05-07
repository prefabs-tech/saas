import type { User } from "@prefabs.tech/fastify-user";
import type { FastifyError, FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

import {
  areRolesExist,
  getUserService,
  sendEmail,
  verifyEmail,
} from "@prefabs.tech/fastify-user";
import { deleteUser } from "supertokens-node";
import EmailVerification from "supertokens-node/recipe/emailverification";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_SAAS_ACCOUNT_MEMBER } from "../../../constants";
import AccountUserService from "../../../model/accountUsers/service";
import Email from "../../utils/email";

const emailPasswordSignUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["emailPasswordSignUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const roles = (input.userContext?.roles || []) as string[];

    if (!(await areRolesExist(roles))) {
      log.error(`At least one role from ${roles.join(", ")} does not exist.`);

      throw {
        message: "Something went wrong",
        name: "SIGN_UP_FAILED",
        statusCode: 500,
      } as FastifyError;
    }

    const originalEmail = input.email;

    input.email = Email.addPrefix(
      originalEmail,
      input.userContext?.authEmailPrefix,
    );

    const originalResponse =
      await originalImplementation.emailPasswordSignUp(input);

    if (originalResponse.status === "OK") {
      const userService = getUserService(
        config,
        slonik,
        input.userContext?.dbSchema,
      );

      let user: null | undefined | User;

      try {
        user = await userService.create({
          email: originalEmail,
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

      if (input.userContext?.account) {
        const accountUserService = new AccountUserService(
          config,
          slonik,
          input.userContext.account.id,
          input.userContext.dbSchema,
        );

        await accountUserService.create({
          accountId: input.userContext.account.id,
          roleId: input.userContext.saasAccountRole || ROLE_SAAS_ACCOUNT_MEMBER,
          userId: originalResponse.user.id,
        });
      }

      user.roles = roles;

      originalResponse.user = {
        ...originalResponse.user,
        ...user,
      };

      for (const role of roles) {
        const rolesResponse = await UserRoles.addRoleToUser(
          originalResponse.user.id,
          role,
        );

        if (rolesResponse.status !== "OK") {
          log.error(rolesResponse.status);
        }
      }

      if (config.user.features?.signUp?.emailVerification) {
        try {
          if (input.userContext?.autoVerifyEmail) {
            // auto verify email
            await verifyEmail(user.id, input.email, input.userContext);
          } else {
            // send email verification
            const tokenResponse =
              await EmailVerification.createEmailVerificationToken(
                originalResponse.user.id,
                input.email,
                input.userContext,
              );

            if (tokenResponse.status === "OK") {
              // [DU 2023-SEP-4] We need to provide all the arguments.
              // emailVerifyLink is same as what would supertokens create.
              await EmailVerification.sendEmail({
                emailVerifyLink: `${config.appOrigin[0]}/auth/verify-email?token=${tokenResponse.token}&rid=emailverification`,
                type: "EMAIL_VERIFICATION",
                user: {
                  email: input.email,
                  id: originalResponse.user.id,
                },
                userContext: input.userContext,
              });
            }
          }
        } catch (error) {
          log.error(error);
        }
      }
    }

    if (
      config.user.supertokens.sendUserAlreadyExistsWarning &&
      originalResponse.status === "EMAIL_ALREADY_EXISTS_ERROR"
    ) {
      try {
        sendEmail({
          fastify,
          subject:
            config.user.emailOverrides?.duplicateEmail?.subject ||
            "Duplicate Email Registration",
          templateData: {
            emailId: input.email,
          },
          templateName:
            config.user.emailOverrides?.duplicateEmail?.templateName ||
            "duplicate-email-warning",
          to: originalEmail,
        });
      } catch (error) {
        log.error(error);
      }
    }

    return originalResponse;
  };
};

export default emailPasswordSignUp;
