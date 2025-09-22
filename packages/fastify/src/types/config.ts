import { User } from "@prefabs.tech/fastify-user";

import accountInvitationHandlers from "../model/accountInvitations/handlers";
import accountHandlers from "../model/accounts/handlers";
import accountTypeHandlers from "../model/accountTypes/handlers";
import accountUserHandlers from "../model/accountUsers/handlers";

import type { AccountInvitation } from "./accountInvitation";
import type { FastifyInstance, FastifyRequest } from "fastify";

interface SaasOptions {
  apps?: [
    {
      name: string;
      subdomain: string;
    },
  ];
  excludeRoutePatterns?: Array<string | RegExp>;
  handlers?: {
    account?: {
      create?: typeof accountHandlers.create;
      delete?: typeof accountHandlers.delete;
      getById?: typeof accountHandlers.getById;
      list?: typeof accountHandlers.list;
      myAccount?: typeof accountHandlers.myAccount;
      myAccounts?: typeof accountHandlers.myAccounts;
      update?: typeof accountHandlers.update;
      updateMyAccount?: typeof accountHandlers.updateMyAccount;
    };
    accountInvitation?: {
      create?: typeof accountInvitationHandlers.create;
      getByAccountId?: typeof accountInvitationHandlers.getByAccountId;
      getByToken?: typeof accountInvitationHandlers.getByToken;
      join?: typeof accountInvitationHandlers.join;
      list?: typeof accountInvitationHandlers.list;
      remove?: typeof accountInvitationHandlers.remove;
      resend?: typeof accountInvitationHandlers.resend;
      revoke?: typeof accountInvitationHandlers.revoke;
      signup?: typeof accountInvitationHandlers.signup;
    };
    accountType?: {
      all?: typeof accountTypeHandlers.all;
      create?: typeof accountTypeHandlers.create;
      remove?: typeof accountTypeHandlers.remove;
      getById?: typeof accountTypeHandlers.getById;
      list?: typeof accountTypeHandlers.list;
      update?: typeof accountTypeHandlers.update;
    };
    accountUser?: {
      getByAccountId?: typeof accountUserHandlers.getByAccountId;
      list?: typeof accountUserHandlers.list;
    };
  };
  invalid?: {
    domains?: string[];
    slugs?: string[];
  };
  invitation?: {
    acceptLinkPath?: string;
    emailOverrides?: {
      subject?:
        | string
        | ((
            fastify: FastifyInstance,
            invitation: AccountInvitation,
          ) => Promise<string>);
      templateName?: string;
    };
    postAccept?: (
      request: FastifyRequest,
      invitation: AccountInvitation,
      user: User,
    ) => Promise<void>;
  };
  mainAppSubdomain: string;
  multiDatabase?: {
    mode: "disabled" | "optional" | "required";
    migrations?: {
      path?: string;
    };
  };
  rootDomain: string;
  routePrefix?: string;
  routes?: {
    accounts?: {
      disabled: boolean;
    };
    accountInvitations?: {
      disabled: boolean;
    };
    accountUsers?: {
      disabled: boolean;
    };
    accountTypes?: {
      disabled: boolean;
    };
  };
  subdomains: "disabled" | "required" | "optional";
  tables?: {
    accounts?: {
      name: string;
    };
    accountTypes?: {
      name: string;
    };
    accountTypesI18n?: {
      name: string;
    };
    accountUsers?: {
      name: string;
    };
    accountAddresses?: {
      name: string;
    };
    accountInvitations?: {
      name: string;
    };
  };
}

export type SaasConfig = SaasOptions;
