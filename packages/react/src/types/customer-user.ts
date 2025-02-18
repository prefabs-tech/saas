export type CustomerUser = {
  id: string;
  email: string;
  timeJoined: number;
  disabled?: boolean;
  givenName: string | null;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  lastLoginAt: number;
  middleNames: string | null;
  role: string;
  signedUpAt: number;
  surname: string | null;
};

export type GetUsersResponse = CustomerUser[];

export type DisableUserResponse = CustomerUser;

export type EnableUserResponse = CustomerUser;
