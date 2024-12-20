import customerHandlers from "../model/customers/handlers";

interface SubdomainsOptions {
  enabled?: boolean;
  migrations?: {
    path?: string;
  };
  multiDatabase?: boolean;
  reserved?: {
    admin?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
    blacklisted?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
    others?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
    www?: {
      domains?: string[];
      enabled?: boolean;
      slugs?: string[];
    };
  };
  required?: boolean;
  rootDomain: string;
}

interface SaasOptions {
  handlers?: {
    customer?: {
      create?: typeof customerHandlers.create;
      delete?: typeof customerHandlers.delete;
      getById?: typeof customerHandlers.getById;
      list?: typeof customerHandlers.list;
      update?: typeof customerHandlers.update;
    };
  };
  subdomains?: SubdomainsOptions;
  ignoreRoutePatterns?: Array<string | RegExp>;
  routes?: {
    customers?: {
      disabled: boolean;
    };
  };
  routePrefix?: string;
}

export type SaasConfig = SaasOptions;
