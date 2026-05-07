import { useTranslation } from "@prefabs.tech/react-i18n";
import {
  TDataTable as DataTable,
  TableColumnDefinition,
  Tag,
  TDataTableProperties,
  TRequestJSON,
} from "@prefabs.tech/react-ui";
import React from "react";

import type { Account } from "@/types";

import { useConfig } from "@/hooks";

export interface AccountsTableProperties extends Partial<
  Omit<TDataTableProperties<Account>, "data" | "fetchData" | "visibleColumns">
> {
  accounts: Array<Account>;
  fetchAccounts?: (arguments_: TRequestJSON) => void;
  visibleColumns?: VisibleColumn[];
}

type VisibleColumn = "name" | "taxId" | "type" | string;

export const AccountsTable = ({
  accounts,
  className = "table-accounts",
  columns = [],
  fetchAccounts,
  totalRecords = 0,
  visibleColumns = ["name", "registeredNumber", "taxId", "type"],
  ...tableOptions
}: AccountsTableProperties) => {
  const { t } = useTranslation("accounts");

  const { entity } = useConfig();

  const entityColumnsOrg: Array<TableColumnDefinition<Account>> = [
    {
      accessorKey: "registeredNumber",
      cell: ({ row: { original } }) => {
        if (!original.registeredNumber) {
          return <code>&#8212;</code>;
        }

        return original.registeredNumber;
      },
      enableColumnFilter: true,
      enableSorting: true,
      header: t("table.columns.registeredNumber"),
    },
    {
      accessorKey: "taxId",
      cell: ({ row: { original } }) => {
        if (!original.taxId) {
          return <code>&#8212;</code>;
        }

        return original.taxId;
      },
      enableColumnFilter: true,
      enableSorting: true,
      header: t("table.columns.taxId"),
    },
  ];

  const entityColumnsInd: Array<TableColumnDefinition<Account>> = [
    {
      accessorKey: "type",
      align: "center",
      cell({ row: { original } }) {
        if (original.individual) {
          return <Tag fullWidth label={t("account.type.individual")} />;
        }

        return (
          <Tag color="green" fullWidth label={t("account.type.organization")} />
        );
      },
      header: t("table.columns.type"),
    },
  ];

  const defaultColumns: Array<TableColumnDefinition<Account>> = [
    {
      accessorKey: "name",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      enableSorting: true,
      header: t("table.columns.name"),
    },
    ...(entity === "both" || entity === "organization" ? entityColumnsOrg : []),
    ...(entity === "both" ? entityColumnsInd : []),
  ];

  return (
    <DataTable
      className={className}
      columns={[...defaultColumns, ...columns]}
      data={accounts}
      emptyTableMessage={t("table.emptyMessage")}
      fetchData={fetchAccounts}
      id="accounts-table"
      initialSorting={[{ desc: false, id: "name" }]}
      paginationOptions={{
        itemsPerPageControlLabel: t("table.pagination.rowsPerPage"),
        pageInputLabel: t("table.pagination.pageControl"),
      }}
      persistState={true}
      totalRecords={totalRecords}
      visibleColumns={visibleColumns}
      {...tableOptions}
    ></DataTable>
  );
};
