import { ROLE_USER } from "@dzangolab/fastify-user";

import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance,
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    const { config } = fastify;
    const request = input.options.req.original as FastifyRequest;

    input.userContext.customer = request.customer;
    input.userContext.dbSchema = request.dbSchema;
    input.userContext.authEmailPrefix = request.authEmailPrefix;

    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    if (config.user.features?.signUp?.enabled === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    input.userContext.roles = [config.user.role || ROLE_USER];

    return await originalImplementation.emailPasswordSignUpPOST(input);
  };
};

export default emailPasswordSignUpPOST;
