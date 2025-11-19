export interface UserSignupData {
  email: string;
  givenName?: string;
  middleNames?: string;
  password: string;
  surname?: string;
}

export interface AccountSignupData extends UserSignupData {
  individual: boolean;
  name: string;
  registeredNumber?: string | null;
  slug?: string | null;
  taxId?: string | null;
  useSeparateDatabase?: boolean | null;
}
