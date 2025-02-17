import type { Customer, User } from "./customer";

export interface CustomerInvitation {
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

export type CustomerInvitationCreateInput = Omit<
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

export type CustomerInvitationUpdateInput = Partial<
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

export interface InvitationRoleOption {
  name: string;
  id: number;
}

export interface InvitationExpiryDateField {
  display: boolean;
  mode: "calendar" | "input";
}

export type GetInvitationsResponse = CustomerInvitation[];

export type AddInvitationResponse = CustomerInvitation;

export type DeleteInvitationResponse = CustomerInvitation;

export type ResendInvitationResponse = CustomerInvitation;

export type RevokeInvitationResponse = CustomerInvitation;

export type GetInvitationResponse = CustomerInvitation;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptInvitationResponse = any;
