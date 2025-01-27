import { AccountSwitcher } from "./components/accounts";
import { CustomerForm, CustomersTable } from "./components/customer";
import { Customer } from "./components/customer/Customer";

import AccountsProvider, { accountsContext } from "./contexts/AccountsProvider";

import "./assets/css/index.css";

export * from "./hooks";

export * from "./types";

export {
  // components
  AccountSwitcher,
  CustomerForm,
  CustomersTable,
  Customer,

  // contexts
  accountsContext,
  AccountsProvider,
};
