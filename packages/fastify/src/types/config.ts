import customerHandlers from "../model/customers/handlers";

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
      update?: typeof customerHandlers.update;
    };
  };
  invalid: {
    domains?: string[];
    slugs?: string[];
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
  };
  subdomains: "disabled" | "required" | "optional";
}

export type SaasConfig = SaasOptions;
