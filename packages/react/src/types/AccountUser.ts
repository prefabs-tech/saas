export type AccountUser = {
  disabled?: boolean;
  email: string;
  givenName: null | string;
  id: string;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  lastLoginAt: number;
  middleNames: null | string;
  role: string;
  signedUpAt: number;
  surname: null | string;
  timeJoined: number;
};

export type DisableAccountUserResponse = AccountUser;

export type EnableAccountUserResponse = AccountUser;

export type GetAccountUsersResponse = AccountUser[];
