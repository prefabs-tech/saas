export type AccountUser = {
  disabled?: boolean;
  email: string;
  givenName: string | null;
  id: string;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  lastLoginAt: number;
  middleNames: string | null;
  role: string;
  signedUpAt: number;
  surname: string | null;
  timeJoined: number;
};

export type GetAccountUsersResponse = AccountUser[];

export type DisableAccountUserResponse = AccountUser;

export type EnableAccountUserResponse = AccountUser;
