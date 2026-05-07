interface Account {
  database: null | string;
  domain: null | string;
  id: string;
  individual: boolean;
  name: string;
  registeredNumber: null | string;
  slug: null | string;
  taxId: null | string;
  typeId: null | number;
}

type AccountCreateInput = Partial<Omit<Account, "id">> & {
  useSeparateDatabase?: boolean;
};

type AccountUpdateInput = Partial<Omit<Account, "database" | "id" | "name">>;

export type { Account, AccountCreateInput, AccountUpdateInput };
