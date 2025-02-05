export type SaasConfig = {
  accounts: {
    autoSelectAccount?: boolean;
    allowMultipleSessions?: boolean;
    accountStorageKey?: string;
    signup?: {
      path?: string;
      termsAndConditionsUrl?: string;
    };
  };
  apiBaseUrl: string;
  mainAppSubdomain: string;
  rootDomain: string;
};
