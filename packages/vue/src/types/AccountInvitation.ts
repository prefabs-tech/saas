import type { Account, User } from "./account";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptInvitationResponse = any;

export interface AccountInvitation {
  acceptedAt?: number;
  account?: Account;
  accountId: string;
  createdAt: number;
  email: string;
  expiresAt: number;
  id: number;
  invitedBy?: User;
  invitedById: string;
  payload?: Record<string, unknown>;
  revokedAt?: number;
  role: string;
  token: string;
  updatedAt: number;
  user?: User;
  userId?: string;
}

export type AccountInvitationCreateInput = Omit<
  AccountInvitation,
  | "acceptedAt"
  | "account"
  | "accountId"
  | "createdAt"
  | "expiresAt"
  | "id"
  | "invitedBy"
  | "invitedById"
  | "payload"
  | "revokedAt"
  | "token"
  | "updatedAt"
  | "user"
> & {
  expiresAt: string;
  payload?: string;
};

export type AccountInvitationUpdateInput = Partial<
  Omit<
    AccountInvitation,
    | "acceptedAt"
    | "account"
    | "accountId"
    | "createdAt"
    | "email"
    | "expiresAt"
    | "id"
    | "invitedBy"
    | "invitedById"
    | "payload"
    | "revokedAt"
    | "role"
    | "token"
    | "updatedAt"
    | "user"
  > & {
    acceptedAt: string;
    expiresAt: string;
    revokedAt: string;
  }
>;

export type AddAccountInvitationResponse = AccountInvitation;

export type DeleteAccountInvitationResponse = AccountInvitation;

export type GetAccountInvitationsResponse = AccountInvitation[];

export type GetInvitationResponse = AccountInvitation;

export interface InvitationExpiryDateField {
  display: boolean;
  mode: "calendar" | "input";
}

export type ResendAccountInvitationResponse = AccountInvitation;

export type RevokeAccountInvitationResponse = AccountInvitation;
