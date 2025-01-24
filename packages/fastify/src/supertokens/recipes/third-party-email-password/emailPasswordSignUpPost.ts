import { ROLE_USER } from "@dzangolab/fastify-user";

import getSaasConfig from "../../../config";
import {
  ROLE_SAAS_ACCOUNT_MEMBER,
  ROLE_SAAS_ACCOUNT_OWNER,
} from "../../../constants";
import getHost from "../../../lib/getHost";
import customerService from "../../../model/customers/service";

import type { Customer, CustomerCreateInput } from "../../../types";
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance,
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    const request = input.options.req.original as FastifyRequest<{
      Body: {
        customerFormFields: { id: string; value: string | number | boolean }[];
        formFields: { id: string; value: string }[];
      };
    }>;

    const {
      body,
      config,
      customer,
      dbSchema,
      authEmailPrefix,
      headers,
      slonik,
    } = request;

    input.userContext.customer = customer;
    input.userContext.dbSchema = dbSchema;
    input.userContext.authEmailPrefix = authEmailPrefix;

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
    input.userContext.saasAccountRole = ROLE_SAAS_ACCOUNT_MEMBER;

    const hostname = getHost(
      headers.referer || headers.origin || request.hostname,
    );

    const saasConfig = getSaasConfig(config);

    const mainAppDomain = `${saasConfig.mainAppSubdomain}.${saasConfig.rootDomain}`;

    if (hostname === mainAppDomain) {
      const service = new customerService(config, slonik);

      const { customerFormFields } = body;

      const customerCreateInput: CustomerCreateInput = Object.fromEntries(
        customerFormFields.map(
          (customerFormField: {
            id: string;
            value: string | number | boolean;
          }) => [customerFormField.id, customerFormField.value],
        ),
      );

      const customer = (await service.create(
        customerCreateInput,
      )) as unknown as Customer;
      input.userContext.customer = customer;

      // set db schema for multi-database on request object
      if (customer.database) {
        input.userContext.dbSchema = customer.database;
      }

      // set auth email prefix for user isolation on request object
      if (customer.slug && customer.database) {
        input.userContext.authEmailPrefix = `${customer.id}_`;
      }

      input.userContext.saasAccountRole = ROLE_SAAS_ACCOUNT_OWNER;
    }

    return await originalImplementation.emailPasswordSignUpPOST(input);
  };
};

export default emailPasswordSignUpPOST;
