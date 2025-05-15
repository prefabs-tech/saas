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
  mainAppSubdomain: string;
  entity: "both" | "individual" | "organization";
  rootDomain: string;
  multiDatabase: boolean;
  saasAccountRoles?: string[];
  subdomains: "required" | "optional" | "disabled";
};
