import { AccountSignupForm, AccountSwitcher } from "./components/accounts";
import { CustomerForm, CustomersTable } from "./components/customer";
import { Customer } from "./components/customer/Customer";
import AccountsProvider, { accountsContext } from "./contexts/AccountsProvider";
import "./assets/css/index.css";
import { SaasOptions } from "./types";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { AppConfig } from "@dzangolab/react-config";
declare module "@dzangolab/react-config" {
  export interface AppConfig {
    saas: SaasOptions;
  }
}

export * from "./hooks";

export * from "./types";

export {
  // components
  AccountSignupForm,
  AccountSwitcher,
  CustomerForm,
  CustomersTable,
  Customer,

  // contexts
  accountsContext,
  AccountsProvider,
};
