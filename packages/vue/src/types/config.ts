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
  ui?: {
    account?: {
      form?: {
        actionsAlignment?: "center" | "filled" | "left" | "right";
        actionsReverse?: boolean;
      };
    };
    invitation?: {
      form?: {
        actionsAlignment?: "center" | "filled" | "left" | "right";
        actionsReverse?: boolean;
      };
    };
    signup?: {
      form?: {
        actionsAlignment?: "center" | "filled" | "left" | "right";
        actionsReverse?: boolean;
      };
    };
  };
};
