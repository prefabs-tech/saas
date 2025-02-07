import { z } from "zod";
import { customerSchema } from "../schemas";

export type Customer = z.infer<typeof customerSchema>;

export type CustomerCreateInput = Omit<
  Customer,
  "id" | "createdAt" | "updatedAt" | "database"
> & {
  useSeparateDatabase?: boolean;
};

export type CustomerUpdateInput = Partial<
  Omit<Customer, "id" | "createdAt" | "updatedAt">
>;

export type UserSignupData = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type CustomerSignupData = UserSignupData & {
  id: string;
  individual: boolean;
  name: string;
  organizationName: string | null;
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
