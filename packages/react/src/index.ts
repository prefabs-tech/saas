/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { AppConfig } from "@prefabs.tech/react-config";

import {
  AccountForm,
  AccountInfo,
  AccountInvitationForm,
  AccountInvitationModal,
  AccountInvitationsTable,
  AccountSignupForm,
  AccountsTable,
  AccountSwitcher,
  AccountUsersTable,
  MyAccounts,
  UserSignupForm,
} from "@/components";

import AccountsProvider, { accountsContext } from "./contexts/AccountsProvider";
import "./assets/css/index.css";
import { SaasConfig } from "./types";

declare module "@prefabs.tech/react-config" {
  export interface AppConfig {
    saas: SaasConfig;
  }
}
export * from "./api";

export * from "./constants";

export * from "./hooks";

export * from "./routes";

export * from "./SaasWrapper";

export * from "./types";

export * from "./utils";

export {
  AccountForm,
  AccountInfo,
  AccountInvitationForm,
  AccountInvitationModal,
  AccountInvitationsTable,
  // contexts
  accountsContext,
  AccountSignupForm,
  AccountsProvider,
  AccountsTable,
  // components
  AccountSwitcher,
  AccountUsersTable,
  MyAccounts,
  UserSignupForm,
};

export * from "./views";
