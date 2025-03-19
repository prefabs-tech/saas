import {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableIdentifier,
  DefaultSqlFactory,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import {
  FragmentSqlToken,
  QuerySqlToken,
  sql,
  type QueryResultRow,
} from "slonik";
import { z } from "zod";

import type { AccountAwareService } from "./types/service";

/* eslint-disable brace-style */
class AccountAwareSqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends DefaultSqlFactory<T, C, U> {
  /* eslint-enabled */

  protected _service: AccountAwareService<T, C, U>;

  protected _applyAccountIdFilter: boolean = true;

  constructor(service: AccountAwareService<T, C, U>) {
    super(service);

    this._service = service;
  }

  getTableIdentifier = () => {
    return createTableIdentifier(this.table, this.schema);
  };

  getAccountIdFilterFragment = (addWhere: boolean): FragmentSqlToken => {
    return this.accountId && this.applyAccountIdFilter
      ? addWhere
        ? sql.fragment`WHERE ${this.getTableIdentifier()}.account_id = ${this.accountId}`
        : sql.fragment`AND ${this.getTableIdentifier()}.account_id = ${this.accountId}`
      : sql.fragment``;
  };

  getAllSql = (fields: string[], sort?: SortInput[]): QuerySqlToken => {
    const identifiers = [];

    const fieldsObject: Record<string, true> = {};

    for (const field of fields) {
      identifiers.push(sql.identifier([humps.decamelize(field)]));
      fieldsObject[humps.camelize(field)] = true;
    }

    const allSchema =
      this.validationSchema._def.typeName === "ZodObject"
        ? (this.validationSchema as z.AnyZodObject).pick(fieldsObject)
        : z.any();

    return sql.type(allSchema)`
      SELECT ${sql.join(identifiers, sql.fragment`, `)}
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      ${this.getAccountIdFilterFragment(true)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
    `;
  };

  getCountSql = (filters?: FilterInput): QuerySqlToken => {
    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!filters)}
      ;
    `;
  };

  getDeleteSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()} 
      WHERE id = ${id}
      ${this.getAccountIdFilterFragment(false)}
      RETURNING *;
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      WHERE id = ${id}
      ${this.getAccountIdFilterFragment(false)}
      ;
    `;
  };

  getFindOneSql = (
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!filters)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
      LIMIT 1;
    `;
  };

  getFindSql = (filters?: FilterInput, sort?: SortInput[]): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!filters)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))};
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!filters)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  get service(): AccountAwareService<T, C, U> {
    return this._service;
  }

  get accountId(): string | undefined {
    return this.service.accountId;
  }

  get applyAccountIdFilter(): boolean {
    return this._applyAccountIdFilter;
  }
}

export default AccountAwareSqlFactory;
