import type { Account } from "./account";
import type { User } from "@prefabs.tech/fastify-user";

interface AccountInvitation {
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

type AccountInvitationCreateInput = Omit<
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

type AccountInvitationUpdateInput = Partial<
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

export type {
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
};
