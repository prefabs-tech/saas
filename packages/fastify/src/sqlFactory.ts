import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { Service } from "./types/service";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class SqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends DefaultSqlFactory<T, C, U> {
  /* eslint-enabled */

  protected _service: Service<T, C, U>;

  constructor(service: Service<T, C, U>) {
    super(service);

    this._service = service;
  }

  get service(): Service<T, C, U> {
    return this._service;
  }

  get accountId(): string | undefined {
    return this.service.accountId;
  }
}

export default SqlFactory;
