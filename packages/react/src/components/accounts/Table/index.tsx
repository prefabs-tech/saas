import { useTranslation } from "@dzangolab/react-i18n";
import {
  TDataTable as DataTable,
  TDataTableProperties,
  TRequestJSON,
  TableColumnDefinition,
  Tag,
} from "@dzangolab/react-ui";
import React from "react";

import type { Account } from "@/types";

type VisibleColumn = "name" | "taxId" | "type" | string;

export interface AccountsTableProperties
  extends Partial<
    Omit<TDataTableProperties<Account>, "data" | "visibleColumns" | "fetchData">
  > {
  fetchAccounts?: (arguments_: TRequestJSON) => void;
  accounts: Array<Account>;
  visibleColumns?: VisibleColumn[];
}

export const AccountsTable = ({
  className = "table-accounts",
  columns = [],
  accounts,
  totalRecords = 0,
  visibleColumns = ["name", "registeredNumber", "taxId", "type"],
  fetchAccounts,
  ...tableOptions
}: AccountsTableProperties) => {
  const { t } = useTranslation("accounts");

  const defaultColumns: Array<TableColumnDefinition<Account>> = [
    {
      accessorKey: "name",
      header: t("table.columns.name"),
      enableSorting: true,
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "registeredNumber",
      header: t("table.columns.registeredNumber"),
      cell: ({ row: { original } }) => {
        if (!original.registeredNumber) {
          return <code>&#8212;</code>;
        }

        return original.registeredNumber;
      },
    },
    {
      accessorKey: "taxId",
      header: t("table.columns.taxId"),
      cell: ({ row: { original } }) => {
        if (!original.taxId) {
          return <code>&#8212;</code>;
        }

        return original.taxId;
      },
    },
    {
      align: "center",
      accessorKey: "individual",
      header: t("table.columns.type"),
      cell({ row: { original } }) {
        if (original.individual) {
          return (
            <Tag fullWidth label={t("form.fields.type.options.individual")} />
          );
        }

        return (
          <Tag
            fullWidth
            label={t("form.fields.type.options.organization")}
            color="green"
          />
        );
      },
    },
  ];

  return (
    <DataTable
      className={className}
      columns={[...defaultColumns, ...columns]}
      data={accounts}
      emptyTableMessage={t("table.emptyMessage")}
      fetchData={fetchAccounts}
      totalRecords={totalRecords}
      visibleColumns={visibleColumns}
      paginationOptions={{
        pageInputLabel: t("table.pagination.pageControl"),
        itemsPerPageControlLabel: t("table.pagination.rowsPerPage"),
      }}
      {...tableOptions}
    ></DataTable>
  );
};
