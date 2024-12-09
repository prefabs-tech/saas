import { gql } from "graphql-tag";

import type { DocumentNode } from "graphql";

const customerSchema: DocumentNode = gql`
  input CustomerCreateInput {
    name: String!
    organizationName: String
    registeredNumber: String
    taxId: String
    individual: Boolean!
    slug: String!
    domain: String
  }

  input CustomerUpdateInput {
    organizationName: String
    registeredNumber: String
    taxId: String
  }

  type Mutation {
    createCustomer(data: CustomerCreateInput!): Customer @auth
    deleteCustomer(id: Int!): Customer @auth
    updateCustomer(id: Int!, data: CustomerUpdateInput!): Customer @auth
  }

  type Customers {
    totalCount: Int
    filteredCount: Int
    data: [Customer]!
  }

  type Customer {
    id: String!
    name: String!
    organizationName: String
    registeredNumber: String
    taxId: String
    individual: Boolean!
    slug: String!
    domain: String
  }

  type Query {
    customers(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Customers! @auth
    customer(id: Int!): Customer @auth
  }
`;

export default customerSchema;
