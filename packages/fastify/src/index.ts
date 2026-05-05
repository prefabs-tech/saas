import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import type { Account, SaasConfig } from "./types";

declare module "fastify" {
  interface FastifyContextConfig {
    saas?: {
      exclude?: boolean;
    };
  }

  interface FastifyInstance {
    verifySession: typeof verifySession;
  }

  interface FastifyRequest {
    account?: Account;
    authEmailPrefix?: string;
  }
}

declare module "mercurius" {
  interface MercuriusContext {
    config: ApiConfig;
    database: Database;
  }
}

declare module "@prefabs.tech/fastify-config" {
  interface ApiConfig {
    saas: SaasConfig;
  }
}

export * from "./constants";

export { default as accountInvitationRoutes } from "./model/accountInvitations/controller";
export { default as AccountInvitationService } from "./model/accountInvitations/service";
export { default as accountRoutes } from "./model/accounts/controller";
export { default as accountResolver } from "./model/accounts/resolver";
export { default as accountSchema } from "./model/accounts/schema";
export { default as AccountService } from "./model/accounts/service";
export { default as AccountTypeService } from "./model/accountTypes/service";
export { default as accountUserRoutes } from "./model/accountUsers/controller";
export { default as AccountUserService } from "./model/accountUsers/service";
export { default } from "./plugin";
export { default as accountMigrationPlugin } from "./plugins/migratePlugin";
export { default as AccountAwareBaseService } from "./service";
export { default as AccountAwareSqlFactory } from "./sqlFactory";

export { default as supertokensRecipesConfig } from "./supertokens/recipes";

export type * from "./types";
