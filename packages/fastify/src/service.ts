import { BaseService } from "@dzangolab/fastify-slonik";

import AccountEnabledSqlFactory from "./sqlFactory";

import type { Service } from "./types/service";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
abstract class ExtendedBaseService<
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

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountEnabledSqlFactory<T, C, U>(this);
    }

    return this._factory as AccountEnabledSqlFactory<T, C, U>;
  }

  get accountId(): string | undefined {
    return this.accountId;
  }
}

export default ExtendedBaseService;
