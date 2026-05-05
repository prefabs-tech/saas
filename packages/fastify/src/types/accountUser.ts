interface AccountUser {
  accountId: string;
  id: number;
  roleId: string;
  userId: string;
}

type AccountUserCreateInput = Partial<Omit<AccountUser, "id">> & {
  useSeparateDatabase?: boolean;
};

type AccountUserUpdateInput = Partial<
  Omit<AccountUser, "accountId" | "id" | "userId">
>;

export type { AccountUser, AccountUserCreateInput, AccountUserUpdateInput };
