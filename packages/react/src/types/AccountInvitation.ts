import type { Account, User } from "./account";

export interface AccountInvitation {
  id: number;
  acceptedAt?: number;
  account?: Account;
  accountId: string;
  email: string;
  expiresAt: number;
  invitedBy?: User;
  invitedById: string;
  payload?: Record<string, unknown>;
  revokedAt?: number;
  role: string;
  token: string;
  user?: User;
  userId?: string;
  createdAt: number;
  updatedAt: number;
}

export type AccountInvitationCreateInput = Omit<
  AccountInvitation,
  | "id"
  | "acceptedAt"
  | "account"
  | "expiresAt"
  | "invitedBy"
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
