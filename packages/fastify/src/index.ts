import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import type { SaasConfig, Account } from "./types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }

  interface FastifyRequest {
    authEmailPrefix?: string;
    account?: Account;
  }

  interface FastifyContextConfig {
    saas?: {
      exclude?: boolean;
    };
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

export { default as accountInvitationRoutes } from "./model/accountInvitations/controller";
export { default as accountRoutes } from "./model/accounts/controller";
export { default as accountResolver } from "./model/accounts/resolver";
export { default as accountSchema } from "./model/accounts/schema";
export { default as accountMigrationPlugin } from "./plugins/migratePlugin";
export { default as accountUserRoutes } from "./model/accountUsers/controller";
export { default as supertokensRecipesConfig } from "./supertokens/recipes";
export { default as AccountService } from "./model/accounts/service";
export { default as AccountInvitationService } from "./model/accountInvitations/service";
export { default as AccountUserService } from "./model/accountUsers/service";
export { default as AccountTypeService } from "./model/accountTypes/service";
export { default as AccountAwareBaseService } from "./service";
export { default as AccountAwareSqlFactory } from "./sqlFactory";

export { default } from "./plugin";

export type * from "./types";
