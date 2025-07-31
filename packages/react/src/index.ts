import {
  AccountSwitcher,
  AccountForm,
  AccountInfo,
  AccountInvitationForm,
  AccountInvitationModal,
  AccountInvitationsTable,
  AccountSignupForm,
  AccountUsersTable,
  AccountsTable,
  MyAccounts,
  UserSignupForm,
} from "@/components";

import AccountsProvider, { accountsContext } from "./contexts/AccountsProvider";
import { SaasConfig } from "./types";
import "./assets/css/index.css";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { AppConfig } from "@prefabs.tech/react-config";

declare module "@prefabs.tech/react-config" {
  export interface AppConfig {
    saas: SaasConfig;
  }
}
export * from "./api";

export * from "./constants";

export * from "./hooks";

export * from "./routes";

export * from "./types";

export * from "./utils";

export * from "./views";

export {
  // components
  AccountSwitcher,
  AccountForm,
  AccountInfo,
  AccountInvitationForm,
  AccountInvitationModal,
  AccountInvitationsTable,
  AccountSignupForm,
  AccountUsersTable,
  AccountsTable,
  MyAccounts,
  UserSignupForm,

  // contexts
  accountsContext,
  AccountsProvider,
};

export * from "./SaasWrapper";
