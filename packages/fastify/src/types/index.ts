interface Customer {
  id: string;
  name: string;
  organizationName: string;
  registeredNumber: string;
  taxId: string;
  individual: boolean;
  slug: string;
  domain: string;
}

type CustomerCreateInput = Partial<Omit<Customer, "id">>;

type CustomerUpdateInput = Partial<Omit<Customer, "id" | "name" | "slug">>;

export type { Customer, CustomerCreateInput, CustomerUpdateInput };

export type { SaasConfig } from "./config";
