interface Account {
  id: string;
  name: string;
  registeredNumber: string | null;
  taxId: string | null;
  individual: boolean;
  typeId: number | null;
  slug: string | null;
  domain: string | null;
  database: string | null;
}

type AccountCreateInput = Partial<Omit<Account, "id">> & {
  useSeparateDatabase?: boolean;
};

type AccountUpdateInput = Partial<
  Omit<Account, "id" | "database" | "name" | "slug">
>;

export type { Account, AccountCreateInput, AccountUpdateInput };
