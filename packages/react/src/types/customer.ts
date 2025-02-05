export type Customer = {
  database: string | null;
  domain: string | null;
  id: string;
  individual: boolean;
  name: string;
  organizationName: string;
  registeredNumber: string;
  slug: string;
  taxId: string;
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
  organizationName: string;
  registeredNumber: string;
  slug: string;
  taxId: string;
  useSeparateDatabase: boolean;
};
