import { ROLE_USER } from "@dzangolab/fastify-user";

import getHost from "../../../lib/getHost";
import getSubdomainsConfig from "../../../lib/getSubdomainsConfig";

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

    const url =
      request.headers.referer || request.headers.origin || request.hostname;

    const host = getHost(url);
    const subdomainsConfig = getSubdomainsConfig(request.config);

    const { admin } = subdomainsConfig.reserved;

    input.userContext.roles = [config.user.role || ROLE_USER];

    // if request from admin app, throw error
    if (
      admin.enabled &&
      (admin.slugs.some(
        (slug) => `${slug}.${subdomainsConfig.rootDomain}` === host,
      ) ||
        admin.domains.includes(host))
    ) {
      throw {
        name: "SIGN_UP_FAILED",
        message: "Admin signUp is not allowed",
        statusCode: 403,
      };
    }

    return await originalImplementation.emailPasswordSignUpPOST(input);
  };
};

export default emailPasswordSignUpPOST;
