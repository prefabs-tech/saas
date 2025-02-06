import type { Customer } from "./customer";
import type { User } from "@dzangolab/fastify-user";

interface CustomerInvitation {
  id: number;
  acceptedAt?: number;
  customer?: Customer;
  customerId: string;
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

type CustomerInvitationCreateInput = Omit<
  CustomerInvitation,
  | "id"
  | "acceptedAt"
  | "customer"
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

type CustomerInvitationUpdateInput = Partial<
  Omit<
    CustomerInvitation,
    | "id"
    | "acceptedAt"
    | "customer"
    | "customerId"
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
  CustomerInvitation,
  CustomerInvitationCreateInput,
  CustomerInvitationUpdateInput,
};
