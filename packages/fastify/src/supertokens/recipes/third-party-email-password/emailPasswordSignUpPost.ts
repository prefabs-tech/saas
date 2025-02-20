import { ROLE_USER } from "@dzangolab/fastify-user";

import getSaasConfig from "../../../config";
import {
  ROLE_SAAS_ACCOUNT_MEMBER,
  ROLE_SAAS_ACCOUNT_OWNER,
} from "../../../constants";
import getHost from "../../../lib/getHost";
import AccountService from "../../../model/accounts/service";

import type { Account, AccountCreateInput } from "../../../types";
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
        accountFormFields?: { id: string; value: string | number | boolean }[];
        formFields: { id: string; value: string }[];
      };
    }>;

    const {
      body,
      config,
      account,
      dbSchema,
      authEmailPrefix,
      headers,
      slonik,
    } = request;

    input.userContext.account = account;
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
      const accountService = new AccountService(config, slonik);

      const { accountFormFields } = body;

      if (!accountFormFields) {
        throw {
          name: "ERROR_MISSING_ACCOUNT_FORM_FIELDS",
          message: "Missing account form fields",
          statusCode: 422,
        } as FastifyError;
      }

      const accountCreateInput: AccountCreateInput = Object.fromEntries(
        accountFormFields.map(
          (accountFormField: {
            id: string;
            value: string | number | boolean;
          }) => [accountFormField.id, accountFormField.value],
        ),
      );

      // TODO: validate accountCreateInput

      const account = (await accountService.create(
        accountCreateInput,
      )) as unknown as Account;
      input.userContext.account = account;

      // set db schema for multi-database on request object
      if (account.database) {
        input.userContext.dbSchema = account.database;
      }

      // set auth email prefix for user isolation on request object
      if (account.slug) {
        input.userContext.authEmailPrefix = `${account.id}_`;
      }

      input.userContext.saasAccountRole = ROLE_SAAS_ACCOUNT_OWNER;

      const response =
        await originalImplementation.emailPasswordSignUpPOST(input);

      if (response.status !== "OK") {
        await accountService.delete(account.id);
      }

      return response;
    }

    return await originalImplementation.emailPasswordSignUpPOST(input);
  };
};

export default emailPasswordSignUpPOST;
