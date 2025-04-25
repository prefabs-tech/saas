import type { EmailPasswordUserType } from "supertokens-web-js/recipe/thirdpartyemailpassword";

interface AuthTokens {
  accessToken: string | null;
  expiresIn?: number | null;
  refreshToken?: string | null;
}

interface LoginCredentials {
  email?: string;
  password: string;
  username?: string;
  withRoles?: string[];
}

interface PasswordResetPayload {
  password: string | null | undefined;
  token: string | null | undefined;
}

interface PasswordResetRequestPayload {
  email: string | null | undefined;
  url: string | null | undefined;
}

interface ChangePasswordPayload {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

type UpdateProfileInputType = {
  email: string;
  givenName: string;
  surname: string;
};

interface User extends EmailPasswordUserType {
  //usertype and emailusertype are same one type with different name in different recipe
  email: string;
  username?: string;
}

interface UserRole {
  id: number;
  role: string;
  name: string;
}

interface UserType extends EmailPasswordUserType {
  disabled?: boolean;
  givenName: string | null;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  lastLoginAt: number;
  middleNames: string | null;
  roles: string[] | UserRole[];
  signedUpAt: number;
  surname: string | null;
  thirdParty?: {
    id: string;
    userId: string;
  };
}

export type {
  AuthTokens,
  ChangePasswordPayload,
  LoginCredentials,
  PasswordResetPayload,
  PasswordResetRequestPayload,
  UpdateProfileInputType,
  User,
  UserType,
};
