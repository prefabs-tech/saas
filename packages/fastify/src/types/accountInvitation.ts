import type { User } from "@prefabs.tech/fastify-user";

import type { Account } from "./account";

interface AccountInvitation {
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

type AccountInvitationCreateInput = Omit<
  AccountInvitation,
  | "acceptedAt"
  | "account"
  | "createdAt"
  | "expiresAt"
  | "id"
  | "invitedBy"
  | "payload"
  | "revokedAt"
  | "token"
  | "updatedAt"
  | "user"
> & {
  expiresAt: string;
  payload?: string;
};

type AccountInvitationUpdateInput = Partial<
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

export type {
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
};
