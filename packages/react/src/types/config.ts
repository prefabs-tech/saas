export type SaasConfig = {
  accounts?: {
    autoSelectAccount?: boolean;
    allowMultipleSessions?: boolean;
    signup?: {
      apiPath?: string;
      appRedirection?: boolean;
      termsAndConditionsUrl?: string;
    };
  };
  apiBaseUrl: string;
  entity: "both" | "individual" | "organization";
  mainAppSubdomain: string;
  rootDomain: string;
  multiDatabase: boolean;
  saasAccountRoles?: string[];
  subdomains: "required" | "optional" | "disabled";
  ui?: {
    account?: {
      form?: {
        actionsAlignment?: "center" | "fill" | "left" | "right";
        actionsReverse?: boolean;
      };
    };
    invitation?: {
      form?: {
        actionsAlignment?: "center" | "fill" | "left" | "right";
        actionsReverse?: boolean;
      };
    };
    signup?: {
      form?: {
        actionsAlignment?: "center" | "fill" | "left" | "right";
        actionsReverse?: boolean;
      };
    };
  };
};
