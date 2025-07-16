export type SaasConfig = {
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
  subdomains: "required" | "optional" | "disabled";
};
