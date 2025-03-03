interface AccountTypesI18n {
  id: number;
  locale: string;
  name: string;
}

type AccountTypesI18nCreateInput = {
  locale: string;
  name: string;
};

interface AccountTypesI18nUpdateInput {
  id?: number;
  locale: string;
  name: string;
}

interface AccountType {
  id: string;
  name?: string;
  forIndividual: boolean;
  forOrganization: boolean;
  i18ns?: AccountTypesI18n[];
}

type AccountTypeCreateInput = {
  forIndividual: boolean;
  forOrganization: boolean;
  i18ns: readonly AccountTypesI18nCreateInput[];
};

interface AccountTypeUpdateInput {
  forIndividual: boolean;
  forOrganization: boolean;
  i18ns: AccountTypesI18nUpdateInput[];
}

interface AccountTypeI18nCreateInput {
  locale: string;
  name: string;
}

export type {
  AccountType,
  AccountTypeCreateInput,
  AccountTypeUpdateInput,
  AccountTypeI18nCreateInput,
  AccountTypesI18nCreateInput,
  AccountTypesI18nUpdateInput,
  AccountTypesI18n,
};
