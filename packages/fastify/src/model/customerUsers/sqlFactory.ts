import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class CustomerUserSqlFactory<
    CustomerUser extends QueryResultRow,
    CustomerUserCreateInput extends QueryResultRow,
    CustomerUserUpdateInput extends QueryResultRow,
  >
  extends DefaultSqlFactory<
    CustomerUser,
    CustomerUserCreateInput,
    CustomerUserUpdateInput
  >
  implements
    SqlFactory<CustomerUser, CustomerUserCreateInput, CustomerUserUpdateInput> {
  /* eslint-enabled */
}

export default CustomerUserSqlFactory;
