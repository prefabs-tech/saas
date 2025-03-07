import {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import {
  FragmentSqlToken,
  IdentifierSqlToken,
  sql,
  type QueryResultRow,
  type QuerySqlToken,
} from "slonik";

import getSaasConfig from "../../config";

import type { AccountTypeI18nCreateInput } from "../../types";
import type {
  FilterInput,
  SortInput,
  SqlFactory,
} from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class AccountTypeSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U>
{
  getAccountTypesI18nTableIdentifier = (): IdentifierSqlToken => {
    return sql.identifier(["ati"]);
  };

  getAccountTypesI18nTableFragment = (): FragmentSqlToken => {
    return createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );
  };
  getAllSql = (fields: string[], sort?: SortInput[]): QuerySqlToken => {
    const identifiers = [];

    const fieldsObject: Record<string, true> = {};

    for (const field of fields) {
      if (field === "i18n") {
        continue;
      }

      identifiers.push(sql.identifier(["at", humps.decamelize(field)]));
      fieldsObject[humps.camelize(field)] = true;
    }

    return sql.unsafe`
      SELECT ${sql.join(identifiers, sql.fragment`, `)},
      ${this.getTableWithI18nFragment()}
      GROUP BY ${this.getTableIdentifier()}.id
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))};
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    return sql.unsafe`
      SELECT 
        ${this.getTableIdentifier()}.*,
        ${this.getTableWithI18nFragment()}
      WHERE ${this.getTableIdentifier()}.id = ${id}
      GROUP BY ${this.getTableIdentifier()}.id;
    `;
  };

  getCreateI18nsSql = (id: number, i18n: AccountTypeI18nCreateInput[]) => {
    return sql.unsafe`
      INSERT INTO ${this.getAccountTypesI18nTableFragment()} (id, locale, name) VALUES
      ${sql.join(
        i18n.map((item) => sql.fragment`(${id}, ${item.locale}, ${item.name})`),
        sql.fragment`,`,
      )}
      RETURNING *;
    `;
  };

  getDeleteI18nsSql = (id: number) => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      DELETE FROM ${accountTypesI18nTable}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.unsafe`
      SELECT ${this.getTableIdentifier()}.*,
      ${this.getTableWithI18nFragment()}
      ${createFilterFragment(filters, this.getTableIdentifier())}
      GROUP BY ${this.getTableIdentifier()}.id
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getTableIdentifier = (): IdentifierSqlToken => {
    return sql.identifier(["at"]);
  };

  getTableWithI18nFragment = (): FragmentSqlToken => {
    return sql.fragment`
      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', ${this.getAccountTypesI18nTableIdentifier()}.id,
            'locale', ${this.getAccountTypesI18nTableIdentifier()}.locale,
            'name', ${this.getAccountTypesI18nTableIdentifier()}.name
          )
        ) FILTER (WHERE ${this.getAccountTypesI18nTableIdentifier()}.id IS NOT NULL), '[]'::json
      ) AS i18n
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      LEFT JOIN ${this.getAccountTypesI18nTableFragment()} AS ${this.getAccountTypesI18nTableIdentifier()}
        ON ${this.getTableIdentifier()}.id = ${this.getAccountTypesI18nTableIdentifier()}.id
    `;
  };

  get saasConfig() {
    return getSaasConfig(this.config);
  }
}

export default AccountTypeSqlFactory;
