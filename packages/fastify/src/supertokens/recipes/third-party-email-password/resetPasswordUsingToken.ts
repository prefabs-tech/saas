import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

import { sendEmail } from "@prefabs.tech/fastify-user";
import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

const resetPasswordUsingToken = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["resetPasswordUsingToken"] => {
  return async (input) => {
    const originalResponse =
      await originalImplementation.resetPasswordUsingToken(input);

    if (originalResponse.status === "OK" && originalResponse.userId) {
      const user = await getUserById(originalResponse.userId, {
        account: input.userContext._default.request.request.account,
        authEmailPrefix:
          input.userContext._default.request.request.authEmailPrefix,
      });

      if (user) {
        sendEmail({
          fastify,
          subject:
            fastify.config.user.emailOverrides?.resetPasswordNotification
              ?.subject || "Reset Password Notification",
          templateData: {
            emailId: user.email,
          },
          templateName:
            fastify.config.user.emailOverrides?.resetPasswordNotification
              ?.templateName || "reset-password-notification",
          to: user.email,
        });
      }
    }

    return originalResponse;
  };
};

export default resetPasswordUsingToken;
