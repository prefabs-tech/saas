interface AccountType {
  forIndividual: boolean;
  forOrganization: boolean;
  i18n?: AccountTypeI18n[];
  id: string;
  name?: string;
}

type AccountTypeCreateInput = {
  forIndividual: boolean;
  forOrganization: boolean;
  i18n?: AccountTypeI18nCreateInput[];
};

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

interface AccountTypeUpdateInput {
  forIndividual: boolean;
  forOrganization: boolean;
  i18n?: AccountTypeI18nUpdateInput[];
}

export type {
  AccountType,
  AccountTypeCreateInput,
  AccountTypeI18n,
  AccountTypeI18nCreateInput,
  AccountTypeI18nUpdateInput,
  AccountTypeUpdateInput,
};
