export interface Customer {
  database: string | null;
  domain: string | null;
  id: string;
  individual: boolean;
  name: string;
  organizationName: string;
  registeredNumber: string;
  slug: string;
  taxId: string;
}

export type CustomerSignupData = {
  confirmPassword: string;
  database: string | null;
  domain: string | null;
  email: string;
  id: string;
  individual: boolean;
  name: string;
  organizationName: string;
  password: string;
  registeredNumber: string;
  slug: string;
  taxId: string;
};
