import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import type { SaasConfig, Account } from "./types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }

  interface FastifyRequest {
    authEmailPrefix: string | undefined;
    account: Account | undefined;
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

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    saas: SaasConfig;
  }
}

export { default as accountInvitationRoutes } from "./model/accountInvitations/controller";
export { default as accountRoutes } from "./model/accounts/controller";
export { default as accountResolver } from "./model/accounts/resolver";
export { default as accountSchema } from "./model/accounts/schema";
export { default as accountService } from "./model/accounts/service";
export { default as accountMigrationPlugin } from "./plugins/migratePlugin";
export { default as accountUserRoutes } from "./model/accountUsers/controller";
export { default as supertokensRecipesConfig } from "./supertokens/recipes";

export { default } from "./plugin";
