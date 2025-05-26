import {
  DefaultSqlFactory,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import { FragmentSqlToken, QuerySqlToken, sql } from "slonik";
import { z } from "zod";

class AccountAwareSqlFactory extends DefaultSqlFactory {
  protected _accountId: string | undefined;

  protected _applyAccountIdFilter: boolean = true;

  getAllSql(fields: string[], sort?: SortInput[]): QuerySqlToken {
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
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      ${this.getAccountIdFilterFragment(true)}
      ${this.getSortFragment(sort)}
    `;
  }

  getCountSql(filters?: FilterInput): QuerySqlToken {
    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      ${this.getFilterFragment(filters)}
      ${this.getAccountIdFilterFragment(!filters)}
      ;
    `;
  }

  getDeleteSql(id: number | string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      WHERE id = ${id}
      ${this.getAccountIdFilterFragment(false)}
      RETURNING *;
    `;
  }

  getFindByIdSql(id: number | string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      WHERE id = ${id}
      ${this.getAccountIdFilterFragment(false)}
      ;
    `;
  }

  getFindOneSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      ${this.getFilterFragment(filters)}
      ${this.getAccountIdFilterFragment(!filters)}
      ${this.getSortFragment(sort)}
      LIMIT 1;
    `;
  }

  getFindSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      ${this.getFilterFragment(filters)}
      ${this.getAccountIdFilterFragment(!filters)}
      ${this.getSortFragment(sort)}
    `;
  }

  getListSql(
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      ${this.getFilterFragment(filters)}
      ${this.getAccountIdFilterFragment(!filters)}
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  }

  get accountId(): string | undefined {
    return this._accountId;
  }

  get applyAccountIdFilter(): boolean {
    return this._applyAccountIdFilter;
  }

  set accountId(accountId: string | undefined) {
    this._accountId = accountId;
  }

  protected getAccountIdFilterFragment(addWhere: boolean): FragmentSqlToken {
    return this.accountId && this.applyAccountIdFilter
      ? addWhere
        ? sql.fragment`WHERE ${this.tableIdentifier}.account_id = ${this.accountId}`
        : sql.fragment`AND ${this.tableIdentifier}.account_id = ${this.accountId}`
      : sql.fragment``;
  }
}

export default AccountAwareSqlFactory;
