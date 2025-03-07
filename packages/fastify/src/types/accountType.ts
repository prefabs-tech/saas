interface AccountTypeI18n {
  id: number;
  locale: string;
  name: string;
}

type AccountTypeI18nCreateInput = {
  locale: string;
  name: string;
};

interface AccountTypeI18nUpdateInput {
  id?: number;
  locale: string;
  name: string;
}

interface AccountType {
  id: string;
  name?: string;
  forIndividual: boolean;
  forOrganization: boolean;
  i18n?: AccountTypeI18n[];
}

type AccountTypeCreateInput = {
  forIndividual: boolean;
  forOrganization: boolean;
  i18n?: AccountTypeI18nCreateInput[];
};

interface AccountTypeUpdateInput {
  forIndividual: boolean;
  forOrganization: boolean;
  i18n?: AccountTypeI18nUpdateInput[];
}

export type {
  AccountType,
  AccountTypeCreateInput,
  AccountTypeUpdateInput,
  AccountTypeI18nCreateInput,
  AccountTypeI18nUpdateInput,
  AccountTypeI18n,
};
