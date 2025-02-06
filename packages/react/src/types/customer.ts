export type Customer = {
  database: string | null;
  domain: string | null;
  id: string;
  individual: boolean;
  name: string;
  organizationName: string | null;
  registeredNumber: string | null;
  slug: string | null;
  taxId: string | null;
  useSeparateDatabase: boolean | null;
};

export type UserSignupData = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type CustomerSignupData = UserSignupData & {
  domain: string | null;
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
export interface UserType {
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
