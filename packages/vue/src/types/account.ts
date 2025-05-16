interface Account {
  createdAt: number;
  database?: string | null;
  domain?: string | null;
  id: string;
  individual: boolean;
  name: string;
  registeredNumber?: string | null;
  slug?: string | null;
  taxId?: string | null;
  updatedAt: number;
}

interface Accounts {
  data: Account[];
  filteredCount: number;
  totalCount: number;
}

interface AccountInput {
  id?: string;
  database?: string | null;
  domain?: string | null;
  individual: boolean;
  name: string;
  registeredNumber?: string | null;
  slug?: string | null;
  taxId?: string | null;
  useSeparateDatabase?: boolean;
}

interface User {
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

export type { Account, Accounts, AccountInput, User };
