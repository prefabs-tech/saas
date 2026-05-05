import type { FastifyInstance, FastifyRequest } from "fastify";

import { User } from "@prefabs.tech/fastify-user";

import type { AccountInvitation } from "./accountInvitation";

import accountInvitationHandlers from "../model/accountInvitations/handlers";
import accountHandlers from "../model/accounts/handlers";
import accountTypeHandlers from "../model/accountTypes/handlers";
import accountUserHandlers from "../model/accountUsers/handlers";

export type SaasConfig = SaasOptions;

type App =
  | {
      domain: string;
      name: string;
      subdomain?: string;
    }
  | {
      domain?: string;
      name: string;
      subdomain: string;
    };

interface SaasOptions {
  apps?: App[];
  excludeRoutePatterns?: Array<RegExp | string>;
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
      getById?: typeof accountTypeHandlers.getById;
      list?: typeof accountTypeHandlers.list;
      remove?: typeof accountTypeHandlers.remove;
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
        | ((
            fastify: FastifyInstance,
            invitation: AccountInvitation,
          ) => Promise<string>)
        | string;
      templateName?: string;
    };
    postAccept?: (
      request: FastifyRequest,
      invitation: AccountInvitation,
      user: User,
    ) => Promise<void>;
  };
  mainApp?: {
    domain?: string;
    skipHostnameCheck?: boolean;
    subdomain?: string;
  };
  /**
   * @deprecated use mainApp?.subdomain instead
   */
  mainAppSubdomain?: string;
  multiDatabase?: {
    migrations?: {
      path?: string;
    };
    mode: "disabled" | "optional" | "required";
  };
  rootDomain: string;
  routePrefix?: string;
  routes?: {
    accountInvitations?: {
      disabled: boolean;
    };
    accounts?: {
      disabled: boolean;
    };
    accountTypes?: {
      disabled: boolean;
    };
    accountUsers?: {
      disabled: boolean;
    };
  };
  subdomains: "disabled" | "optional" | "required";
  tables?: {
    accountAddresses?: {
      name: string;
    };
    accountInvitations?: {
      name: string;
    };
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
  };
}
