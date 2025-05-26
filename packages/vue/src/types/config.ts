export type SaasConfig = {
  accounts?: {
    allowMultipleSessions?: boolean;
    autoSelectAccount?: boolean;
    signup?: {
      apiPath?: string;
      appRedirection?: boolean;
      termsAndConditionsUrl?: string;
    };
  };
  apiBaseUrl: string;
  entity: "both" | "individual" | "organization";
  mainAppSubdomain: string;
  multiDatabase: boolean;
  rootDomain: string;
  saasAccountRoles?: string[];
  subdomains: "required" | "optional" | "disabled";
};
