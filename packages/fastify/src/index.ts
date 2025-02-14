import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import type { SaasConfig, Customer } from "./types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

declare module "fastify" {
  interface FastifyInstance {
    verifySession: typeof verifySession;
  }

  interface FastifyRequest {
    authEmailPrefix?: string;
    customer?: Customer;
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

export { default as customerInvitationRoutes } from "./model/customerInvitations/controller";
export { default as customerRoutes } from "./model/customers/controller";
export { default as customerResolver } from "./model/customers/resolver";
export { default as customerSchema } from "./model/customers/schema";
export { default as customerService } from "./model/customers/service";
export { default as customerMigrationPlugin } from "./plugins/migratePlugin";
export { default as customerUserRoutes } from "./model/customerUsers/controller";
export { default as supertokensRecipesConfig } from "./supertokens/recipes";

export { default } from "./plugin";
