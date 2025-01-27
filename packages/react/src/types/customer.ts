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
