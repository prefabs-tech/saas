interface Customer {
  id: string;
  name: string;
  organizationName: string | null;
  registeredNumber: string | null;
  taxId: string | null;
  individual: boolean;
  slug: string | null;
  domain: string | null;
  database: string | null;
}

type CustomerCreateInput = Partial<Omit<Customer, "id">> & {
  useSeparateDatabase?: boolean;
};

type CustomerUpdateInput = Partial<
  Omit<Customer, "id" | "database" | "name" | "slug">
>;

export type { Customer, CustomerCreateInput, CustomerUpdateInput };
