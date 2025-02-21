interface Account {
  id: string;
  name: string;
  registeredNumber: string | null;
  taxId: string | null;
  individual: boolean;
  slug: string | null;
  domain: string | null;
  database: string | null;
}

interface AccountUser {
  accountId: string;
  userId: string;
  role: string;
}

type AccountCreateInput = Partial<Omit<Account, "id">> & {
  useSeparateDatabase?: boolean;
};

type AccountUpdateInput = Partial<
  Omit<Account, "id" | "database" | "name" | "slug">
>;

export type { Account, AccountCreateInput, AccountUpdateInput, AccountUser };
