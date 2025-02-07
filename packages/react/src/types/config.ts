export type SaasConfig = {
  accounts?: {
    autoSelectAccount?: boolean;
    allowMultipleSessions?: boolean;
    accountStorageKey?: string;
    signup?: {
      path?: string;
      termsAndConditionsUrl?: string;
      appRedirection?: boolean;
    };
  };
  apiBaseUrl: string;
  mainAppSubdomain: string;
  rootDomain: string;
  multiDatabase: boolean;
  subdomains: "required" | "optional" | "disabled";
};
