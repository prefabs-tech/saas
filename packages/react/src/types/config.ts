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
  /**
   * @deprecated use mainApp?.subdomain instead
   */
  mainAppSubdomain?: string;
  mainApp?: {
    subdomain?: string;
    domain?: string;
  };
  multiDatabase: boolean;
  rootDomain: string;
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
