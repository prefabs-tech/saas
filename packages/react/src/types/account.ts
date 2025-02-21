import { z } from "zod";

import { accountSchema } from "../schemas";

export type Account = z.infer<typeof accountSchema>;

export type AccountCreateInput = Omit<
  Account,
  "id" | "createdAt" | "updatedAt" | "database"
> & {
  useSeparateDatabase?: boolean;
};

export type AccountUpdateInput = Partial<
  Omit<Account, "id" | "createdAt" | "updatedAt">
>;

export type UserSignupData = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type AccountSignupData = UserSignupData & {
  id: string;
  individual: boolean;
  name: string;
  registeredNumber: string | null;
  slug: string | null;
  taxId: string | null;
  useSeparateDatabase: boolean | null;
};

// copied from @dzangolab/react-user pacakge
export interface User {
  id: string;
  email: string;
  timeJoined: number;
  disabled?: boolean;
  givenName: string | null;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  lastLoginAt: number;
  middleNames: string | null;
  roles: string[];
  signedUpAt: number;
  surname: string | null;
  thirdParty?: {
    id: string;
    userId: string;
  };
}

export type GetAccountResponse = Account;
