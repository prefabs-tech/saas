import type { Account, User } from "./account";

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
  | "id"
  | "acceptedAt"
  | "account"
  | "accountId"
  | "expiresAt"
  | "invitedBy"
  | "invitedById"
  | "payload"
  | "revokedAt"
  | "token"
  | "user"
  | "createdAt"
  | "updatedAt"
> & {
  expiresAt: string;
  payload?: string;
};

export type AccountInvitationUpdateInput = Partial<
  Omit<
    AccountInvitation,
    | "id"
    | "acceptedAt"
    | "account"
    | "accountId"
    | "email"
    | "expiresAt"
    | "invitedBy"
    | "invitedById"
    | "payload"
    | "revokedAt"
    | "role"
    | "token"
    | "user"
    | "createdAt"
    | "updatedAt"
  > & {
    acceptedAt: string;
    expiresAt: string;
    revokedAt: string;
  }
>;

export interface InvitationExpiryDateField {
  display: boolean;
  mode: "calendar" | "input";
}

export type GetAccountInvitationsResponse = AccountInvitation[];

export type AddAccountInvitationResponse = AccountInvitation;

export type DeleteAccountInvitationResponse = AccountInvitation;

export type ResendAccountInvitationResponse = AccountInvitation;

export type RevokeAccountInvitationResponse = AccountInvitation;

export type GetInvitationResponse = AccountInvitation;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptInvitationResponse = any;
