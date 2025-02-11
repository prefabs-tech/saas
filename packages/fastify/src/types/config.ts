import { User } from "@dzangolab/fastify-user";

import customerHandlers from "../model/customers/handlers";

import type { CustomerInvitation } from "./customerInvitation";
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
    customer?: {
      create?: typeof customerHandlers.create;
      delete?: typeof customerHandlers.delete;
      getById?: typeof customerHandlers.getById;
      list?: typeof customerHandlers.list;
      myAccount?: typeof customerHandlers.myAccount;
      myAccounts?: typeof customerHandlers.myAccounts;
      update?: typeof customerHandlers.update;
      updateMyAccount?: typeof customerHandlers.updateMyAccount;
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
      invitation: CustomerInvitation,
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
    customers?: {
      disabled: boolean;
    };
    customerInvitations?: {
      disabled: boolean;
    };
  };
  subdomains: "disabled" | "required" | "optional";
  tables?: {
    customers?: {
      name: string;
    };
    customerUsers?: {
      name: string;
    };
    customerAddresses?: {
      name: string;
    };
    customerInvitations?: {
      name: string;
    };
  };
}

export type SaasConfig = SaasOptions;
