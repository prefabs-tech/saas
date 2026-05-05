export interface AccountSignupData extends UserSignupData {
  individual: boolean;
  name: string;
  registeredNumber?: null | string;
  slug?: null | string;
  taxId?: null | string;
  useSeparateDatabase?: boolean | null;
}

export interface UserSignupData {
  email: string;
  givenName?: string;
  middleNames?: string;
  password: string;
  surname?: string;
}
