export interface Account {
  id: string;
  name: string;
  registeredNumber?: string | null;
  taxId?: string | null;
  individual: boolean;
  slug?: string | null;
  database?: string | null;
  domain?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface AccountInput {
  name: string;
  registeredNumber?: string | null;
  taxId?: string | null;
  individual: boolean;
  slug?: string | null;
  database?: string | null;
  domain?: string | null;
  useSeparateDatabase?: boolean;
}
