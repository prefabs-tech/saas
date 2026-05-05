import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

import { BaseService } from "@prefabs.tech/fastify-slonik";

import type { AccountAwareService as Service } from "./types/service";

import SqlFactory from "./sqlFactory";

abstract class AccountAwareBaseService<
  T,
  C extends Record<string, unknown>,
  U extends Record<string, unknown>,
>
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  get accountId(): string | undefined {
    return this._accountId;
  }

  get factory(): SqlFactory {
    const factory = super.factory as SqlFactory;
    factory.accountId = this.accountId;

    return factory;
  }

  get sqlFactoryClass() {
    return SqlFactory;
  }

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
}

export default AccountAwareBaseService;
