import {
  DefaultSqlFactory,
  FilterInput,
  isValueExpression,
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
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment()}
      ${this.getSortFragment(sort)};
    `;
  }

  getCountSql(filters?: FilterInput): QuerySqlToken {
    const countSchema = z.object({
      count: z.number(),
    });

    return sql.type(countSchema)`
      SELECT COUNT(*)
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment({ filters })};
    `;
  }

  getDeleteSql(id: number | string, force: boolean = false): QuerySqlToken {
    if (this.softDeleteEnabled && !force) {
      return sql.type(this.validationSchema)`
        UPDATE ${this.tableFragment}
        SET deleted_at = NOW()
        ${this.getWhereFragment({ filterFragment: sql.fragment`id = ${id}` })}
        RETURNING *;
      `;
    }

    return sql.type(this.validationSchema)`
      DELETE FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment({ filterFragment: sql.fragment`id = ${id}` })}
      RETURNING *;
    `;
  }

  getFindByIdSql(id: number | string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment({ filterFragment: sql.fragment`id = ${id}` })};
    `;
  }

  getFindOneSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment({ filters })}
      ${this.getSortFragment(sort)}
      LIMIT 1;
    `;
  }

  getFindSql(filters?: FilterInput, sort?: SortInput[]): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment({ filters })}
      ${this.getSortFragment(sort)};
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
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      ${this.getWhereFragment({ filters })}
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  }

  getUpdateSql(
    id: number | string,
    data: Record<string, unknown>,
  ): QuerySqlToken {
    const columns = [];

    for (const column in data) {
      const value = data[column];

      if (!isValueExpression(value)) {
        continue;
      }

      columns.push(
        sql.fragment`${sql.identifier([humps.decamelize(column)])} = ${value}`,
      );
    }

    return sql.type(this.validationSchema)`
      UPDATE ${this.tableFragment} AS ${this.tableIdentifier}
      SET ${sql.join(columns, sql.fragment`, `)}
      ${this.getWhereFragment({ filterFragment: sql.fragment`id = ${id}` })}
      RETURNING *;
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

  protected getAdditionalFilterFragments(): FragmentSqlToken[] {
    return [this.getAccountIdFilterFragment()];
  }

  protected getAccountIdFilterFragment(): FragmentSqlToken {
    return this.accountId && this.applyAccountIdFilter
      ? sql.fragment`${this.tableIdentifier}.account_id = ${this.accountId}`
      : sql.fragment``;
  }
}

export default AccountAwareSqlFactory;
