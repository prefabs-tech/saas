import { useTranslation } from "@dzangolab/react-i18n";
import {
  TDataTable as DataTable,
  TDataTableProperties,
  TRequestJSON,
  TableColumnDefinition,
  Tag,
} from "@dzangolab/react-ui";
import React from "react";

import type { Customer } from "@/types";

type VisibleColumn = "name" | "taxId" | "type" | string;

export interface CustomersTableProperties
  extends Partial<
    Omit<
      TDataTableProperties<Customer>,
      "data" | "visibleColumns" | "fetchData"
    >
  > {
  fetchCustomers?: (arguments_: TRequestJSON) => void;
  customers: Array<Customer>;
  visibleColumns?: VisibleColumn[];
}

export const CustomersTable = ({
  className = "table-customers",
  columns = [],
  customers,
  fetchCustomers,
  totalRecords = 0,
  visibleColumns = [
    "name",
    "organizationName",
    "registeredNumber",
    "taxId",
    "type",
  ],
  ...tableOptions
}: CustomersTableProperties) => {
  const { t } = useTranslation("customers");

  const defaultColumns: Array<TableColumnDefinition<Customer>> = [
    {
      accessorKey: "name",
      header: t("table.defaultColumns.name"),
      enableSorting: true,
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      align: "left",
      accessorKey: "organizationName",
      header: t("table.defaultColumns.organizationName"),
      cell: ({ row: { original } }) => {
        if (!original.organizationName) {
          return <code>&#8212;</code>;
        }

        return original.organizationName;
      },
    },
    {
      align: "left",
      accessorKey: "registeredNumber",
      header: t("table.defaultColumns.registeredNumber"),
      cell: ({ row: { original } }) => {
        if (!original.registeredNumber) {
          return <code>&#8212;</code>;
        }

        return original.registeredNumber;
      },
    },
    {
      align: "left",
      accessorKey: "taxId",
      header: t("table.defaultColumns.taxId"),
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
      header: t("table.defaultColumns.individual"),
      cell({ row: { original } }) {
        if (original.individual) {
          return <Tag fullWidth label="Individual" />;
        }

        return <Tag fullWidth label="Organization" color="green" />;
      },
    },
  ];

  return (
    <DataTable
      className={className}
      columns={[...defaultColumns, ...columns]}
      data={customers}
      emptyTableMessage={t("table.emptyMessage")}
      fetchData={fetchCustomers}
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
