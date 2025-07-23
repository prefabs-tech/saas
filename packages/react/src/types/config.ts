import { RoutesConfig } from "./routes";

export interface SaasConfig {
  accounts?: {
    autoSelectAccount?: boolean;
    allowMultipleSessions?: boolean;
    signup?: {
      apiPath?: string;
      termsAndConditionsUrl?: string;
      appRedirection?: boolean;
    };
  };
  apiBaseUrl: string;
  entity: "both" | "individual" | "organization";
  mainAppSubdomain: string;
  rootDomain: string;
  multiDatabase: boolean;
  saasAccountRoles?: string[];
  routes?: Partial<RoutesConfig>;
  subdomains: "required" | "optional" | "disabled";
}
