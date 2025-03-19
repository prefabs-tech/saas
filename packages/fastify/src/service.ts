import { BaseService } from "@dzangolab/fastify-slonik";

import type { AccountAwareService as Service } from "./types/service";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
abstract class AccountAwareBaseService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  /* eslint-enabled */
  protected _accountId: string | undefined;

  constructor(
    config: ApiConfig,
    database: Database,
    accountId?: string,
    schema?: string,
  ) {
    super(config, database, schema);

    this._accountId = accountId;
  }

  get accountId(): string | undefined {
    return this._accountId;
  }
}

export default AccountAwareBaseService;
