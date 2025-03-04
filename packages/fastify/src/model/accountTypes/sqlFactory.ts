import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { sql, type QueryResultRow, type QuerySqlToken } from "slonik";

import getSaasConfig from "../../config";

import type { AccountTypeI18nCreateInput } from "../../types";
import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class AccountTypeSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U>
{
  getAccountTypesSql = () => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      SELECT at.id, 
      at.for_individual, 
      at.for_organization,
      COALESCE(
        jsonb_object_agg(ati.locale, jsonb_build_object(
          'id', ati.id,
          'locale', ati.locale,
          'name', ati.name
        )) FILTER (WHERE ati.locale IS NOT NULL),
        '{}'::jsonb
      ) AS i18n
      FROM ${this.getTableFragment()} AS at
      LEFT JOIN ${accountTypesI18nTable} AS ati ON ati.id = at.id
      GROUP BY at.id
      ORDER BY at.id ASC;
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      SELECT 
        at.id, 
        at.for_individual, 
        at.for_organization, 
        COALESCE(
          jsonb_object_agg(ati.locale, jsonb_build_object(
            'id', ati.id,
            'locale', ati.locale,
            'name', ati.name
          )) FILTER (WHERE ati.locale IS NOT NULL),
          '{}'::jsonb
        ) AS i18n
      FROM ${this.getTableFragment()} AS at
      LEFT JOIN ${accountTypesI18nTable} AS ati ON at.id = ati.id
      WHERE at.id = ${id}
      GROUP BY at.id
      ORDER BY at.id ASC;
    `;
  };

  getCreateI18nsSql = (
    id: number,
    i18n: Record<string, AccountTypeI18nCreateInput>,
  ) => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      INSERT INTO ${accountTypesI18nTable} (id, locale, name) VALUES
      ${sql.join(
        Object.entries(i18n).map(
          ([locale, data]) => sql.fragment`(${id}, ${locale}, ${data.name})`,
        ),
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

  get saasConfig() {
    return getSaasConfig(this.config);
  }
}

export default AccountTypeSqlFactory;
