import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import humps from "humps";
import {
  FragmentSqlToken,
  IdentifierSqlToken,
  sql,
  type QuerySqlToken,
} from "slonik";

import getSaasConfig from "../../config";

import type { AccountTypeI18nCreateInput } from "../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class AccountTypeSqlFactory extends DefaultSqlFactory {
  getAllSql(fields: string[], sort?: SortInput[]): QuerySqlToken {
    const identifiers = [];
    const fieldsObject: Record<string, true> = {};

    for (const field of fields) {
      if (field === "i18n") {
        continue;
      }

      identifiers.push(
        sql.identifier(["account_types", humps.decamelize(field)]),
      );

      fieldsObject[humps.camelize(field)] = true;
    }

    return sql.unsafe`
      SELECT ${sql.join(identifiers, sql.fragment`, `)},
      ${this.getTableWithI18nFragment()}
      GROUP BY ${this.tableIdentifier}.id
      ${this.getSortFragment(sort)};
    `;
  }

  getFindByIdSql(id: number | string): QuerySqlToken {
    return sql.unsafe`
      SELECT 
        ${this.tableIdentifier}.*,
        ${this.getTableWithI18nFragment()}
      WHERE ${this.tableIdentifier}.id = ${id}
      GROUP BY ${this.tableIdentifier}.id;
    `;
  }

  getCreateI18nsSql(id: number, i18n: AccountTypeI18nCreateInput[]) {
    return sql.unsafe`
      INSERT INTO ${this.getAccountTypesI18nTableFragment()} (id, locale, name) VALUES
      ${sql.join(
        i18n.map((item) => sql.fragment`(${id}, ${item.locale}, ${item.name})`),
        sql.fragment`,`,
      )}
      RETURNING *;
    `;
  }

  getDeleteI18nsSql(id: number) {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      DELETE FROM ${accountTypesI18nTable}
      WHERE id = ${id}
      RETURNING *;
    `;
  }

  getListSql(
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken {
    return sql.unsafe`
      SELECT ${this.tableIdentifier}.*,
      ${this.getTableWithI18nFragment()}
      ${this.getFilterFragment(filters)}
      GROUP BY ${this.tableIdentifier}.id
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  }

  getTableWithI18nFragment(): FragmentSqlToken {
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
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      LEFT JOIN ${this.getAccountTypesI18nTableFragment()} AS ${this.getAccountTypesI18nTableIdentifier()}
        ON ${this.tableIdentifier}.id = ${this.getAccountTypesI18nTableIdentifier()}.id
    `;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountTypes.name;
  }

  get tableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["account_types"]);
  }

  protected getAccountTypesI18nTableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["account_types_i18n"]);
  }

  protected getAccountTypesI18nTableFragment(): FragmentSqlToken {
    return createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );
  }
}

export default AccountTypeSqlFactory;
