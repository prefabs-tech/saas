interface AccountUser {
  id: number;
  accountId: string;
  userId: string;
  roleId: string;
  disabled: boolean;
}

type AccountUserCreateInput = Partial<Omit<AccountUser, "id">> & {
  useSeparateDatabase?: boolean;
};

type AccountUserUpdateInput = Partial<
  Omit<AccountUser, "id" | "accountId" | "userId">
>;

export type { AccountUser, AccountUserCreateInput, AccountUserUpdateInput };
