export type AccountUser = {
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

export type GetAccountUsersResponse = AccountUser[];

export type DisableAccountUserResponse = AccountUser;

export type EnableAccountUserResponse = AccountUser;
