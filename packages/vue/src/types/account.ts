interface Account {
  createdAt: number;
  database?: null | string;
  domain?: null | string;
  id: string;
  individual: boolean;
  name: string;
  registeredNumber?: null | string;
  slug?: null | string;
  taxId?: null | string;
  updatedAt: number;
}

interface AccountInput {
  database?: null | string;
  domain?: null | string;
  id?: string;
  individual: boolean;
  name: string;
  registeredNumber?: null | string;
  slug?: null | string;
  taxId?: null | string;
  useSeparateDatabase?: boolean;
}

interface Accounts {
  data: Account[];
  filteredCount: number;
  totalCount: number;
}

interface User {
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

export type { Account, AccountInput, Accounts, User };
