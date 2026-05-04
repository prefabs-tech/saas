import { z } from "zod";

import { accountSchema } from "../schemas";

export type Account = z.infer<typeof accountSchema>;

export type AccountCreateInput = Omit<
  Account,
  "createdAt" | "database" | "id" | "updatedAt"
> & {
  useSeparateDatabase?: boolean;
};

export type AccountSignupData = UserSignupData & {
  id: string;
  individual: boolean;
  name: string;
  registeredNumber: null | string;
  slug: null | string;
  taxId: null | string;
  useSeparateDatabase: boolean | null;
};

export type AccountUpdateInput = Partial<
  Omit<Account, "createdAt" | "id" | "updatedAt">
>;

export type AddAccountResponse = Account;

export type EditAccountResponse = Account;

export type GetAccountResponse = Account;

// copied from @prefabs.tech/react-user pacakge
export interface User {
  disabled?: boolean;
  email: string;
  givenName: null | string;
  id: string;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  lastLoginAt: number;
  middleNames: null | string;
  roles: string[];
  signedUpAt: number;
  surname: null | string;
  thirdParty?: {
    id: string;
    userId: string;
  };
  timeJoined: number;
}

export type UserSignupData = {
  confirmPassword: string;
  email: string;
  password: string;
};
