import { User } from "@dzangolab/fastify-user";

import accountHandlers from "../model/accounts/handlers";

import type { AccountInvitation } from "./accountInvitation";
import type { FastifyRequest } from "fastify";

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
  };
  invalid?: {
    domains?: string[];
    slugs?: string[];
  };
  invitation?: {
    acceptLinkPath?: string;
    postAccept?: (
      request: FastifyRequest,
      invitation: AccountInvitation,
      user: User,
    ) => Promise<void>;
  };
  mainAppSubdomain: string;
  multiDatabase?: {
    enabled: boolean;
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
