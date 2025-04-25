interface Invitation {
  acceptedAt: number | null;
  appId: number;
  createdAt: number;
  email: string;
  expiresAt: number;
  id: number;
  invitedById: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  revokedAt: number | null;
  role: string;
  token?: string;
  updatedAt: number;
}

interface InvitationAppOption {
  id: number;
  name: string;
  origin: string;
  supportedRoles: InvitationRoleOption[];
  label?: string;
}

interface InvitationPayload {
  email: string;
  role?: string;
  appId?: number;
  expiresAt?: Date | string;
}

interface InvitationRoleOption {
  name: string;
  id: number;
}

export type { Invitation, InvitationAppOption, InvitationPayload, InvitationRoleOption };
