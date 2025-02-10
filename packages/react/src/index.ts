import {
  AccountSwitcher,
  CustomerSignupForm,
  UserSignupForm,
} from "./components/accounts";
import { CustomerForm, CustomersTable } from "./components/customers";
import { CustomerInfo } from "./components/customers/CustomerInfo";
import AccountsProvider, { accountsContext } from "./contexts/AccountsProvider";
import { SaasConfig } from "./types";
import "./assets/css/index.css";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { AppConfig } from "@dzangolab/react-config";

declare module "@dzangolab/react-config" {
  export interface AppConfig {
    saas: SaasConfig;
  }
}

export * from "./constants";

export * from "./hooks";

export * from "./types";

export * from "./utils";

export * from "./views";

export {
  // components
  AccountSwitcher,
  CustomerInfo,
  CustomerForm,
  CustomerSignupForm,
  CustomersTable,
  UserSignupForm,

  // contexts
  accountsContext,
  AccountsProvider,
};
