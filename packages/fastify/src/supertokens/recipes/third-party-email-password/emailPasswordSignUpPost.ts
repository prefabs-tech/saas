import { ROLE_USER } from "@dzangolab/fastify-user";

import { ROLE_SAAS_OWNER } from "../../../constants";
import getHost from "../../../lib/getHost";
import getSubdomainsConfig from "../../../lib/getSubdomainsConfig";

import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    const request = input.options.req.original as FastifyRequest;

    const url =
      request.headers.referer || request.headers.origin || request.hostname;

    const host = getHost(url);
    const subdomainsConfig = getSubdomainsConfig(request.config);

    const { admin, www } = subdomainsConfig.reserved;

    input.userContext.roles =
      www.enabled &&
      (www.slugs.some(
        (slug) => `${slug}.${subdomainsConfig.rootDomain}` === host
      ) ||
        www.domains.includes(host))
        ? [ROLE_SAAS_OWNER]
        : [request.config.user.role || ROLE_USER];

    // if request from admin app, throw error
    if (
      admin.enabled &&
      (admin.slugs.some(
        (slug) => `${slug}.${subdomainsConfig.rootDomain}` === host
      ) ||
        admin.domains.includes(host))
    ) {
      throw {
        name: "SIGN_UP_FAILED",
        message: "Admin signUp is not allowed",
        statusCode: 403,
      };
    }

    input.userContext.customer = request.customer;
    input.userContext.dbSchema = request.dbSchema;

    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    if (fastify.config.user.features?.signUp?.enabled === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    return await originalImplementation.emailPasswordSignUpPOST(input);
  };
};

export default emailPasswordSignUpPOST;
