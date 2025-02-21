import { gql } from "graphql-tag";

import type { DocumentNode } from "graphql";

const accountSchema: DocumentNode = gql`
  input AccountCreateInput {
    name: String!
    registeredNumber: String
    taxId: String
    individual: Boolean!
    slug: String!
    domain: String
  }

  input AccountUpdateInput {
    registeredNumber: String
    taxId: String
  }

  type Mutation {
    createAccount(data: AccountCreateInput!): Account @auth
    deleteAccount(id: Int!): Account @auth
    updateAccount(id: Int!, data: AccountUpdateInput!): Account @auth
  }

  type Accounts {
    totalCount: Int
    filteredCount: Int
    data: [Account]!
  }

  type Account {
    id: String!
    name: String!
    registeredNumber: String
    taxId: String
    individual: Boolean!
    slug: String!
    domain: String
  }

  type Query {
    accounts(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Accounts! @auth
    account(id: Int!): Account @auth
  }
`;

export default accountSchema;
