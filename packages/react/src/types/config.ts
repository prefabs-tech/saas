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
  mainApp?: {
    domain?: string;
    subdomain?: string;
  };
  /**
   * @deprecated use mainApp?.subdomain instead
   */
  mainAppSubdomain?: string;
  multiDatabase: boolean;
  rootDomain: string;
  saasAccountRoles?: string[];
  subdomains: "disabled" | "optional" | "required";
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
