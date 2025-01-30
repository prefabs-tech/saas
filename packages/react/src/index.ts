import { AccountSwitcher } from "./components/accounts";
import { CustomerForm, CustomersTable } from "./components/customer";
import { Customer } from "./components/customer/Customer";
import { CustomerSignupForm } from "./components/customer/Signup";
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
  AccountSwitcher,
  CustomerForm,
  CustomersTable,
  Customer,
  CustomerSignupForm,

  // contexts
  accountsContext,
  AccountsProvider,
};
