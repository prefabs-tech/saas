<template>
  <Page :title="t('customers.title')">
    <Table
      id="customers-table"
      :columns-data="columns"
      :data="accounts"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('customers.table.emptyMessage')"
      :is-loading="isLoading"
      class="table-customers"
      @action:select="onActionSelect"
    >
      <template #toolbar>
        <ButtonElement
          :label="t('customers.table.actions.addCustomer')"
          icon-left="pi pi-plus"
          @click="onCreateCustomer"
        />
      </template>
    </Table>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { ButtonElement } from "@dzangolab/vue3-ui";
import { ref, onMounted, h } from "vue";
import { useRouter } from "vue-router";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account } from "../../types/account";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { TableColumnDefinition } from "@dzangolab/vue3-tanstack-table";

defineProps({
  isLoading: Boolean,
});

const accountsStore = useAccountsStore();
const { getAccounts, deleteAccount } = accountsStore;
const config = useConfig() as AppConfig;

const router = useRouter();

const messages = useTranslations();
const { t } = useI18n({ messages });

const accounts = ref<Account[]>([]);
const account = ref<Account | undefined>(undefined);

const columns: TableColumnDefinition<Account>[] = [
  {
    accessorKey: "name",
    enableColumnFilter: true,
    enableSorting: true,
    filterPlaceholder: "Search by name...",
    header: t("customers.table.columns.name"),
    cell: ({ row: { original } }) =>
      h(
        "div",
        {
          class: "cell-name",
        },
        [
          h(
            "a",
            {
              href: `/customers/${original.id}`,
              class: "customer-link",
              onClick: (event: Event) => {
                event.preventDefault();
                router.push(`/customers/${original.id}`);
              },
            },
            original.name
          ),
        ]
      ),
  },
  {
    accessorKey: "registeredNumber",
    header: t("customers.table.columns.registeredNumber"),
  },
  {
    accessorKey: "taxId",
    header: t("customers.table.columns.taxId"),
  },
];

const actionMenuData = [
  {
    key: "editCustomer",
    label: t("customers.table.actions.editCustomer"),
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t("customers.table.confirmation.deleteCustomer.message"),
      header: t("customers.table.confirmation.deleteCustomer.header"),
    },
    key: "deleteCustomer",
    label: t("customers.table.actions.deleteCustomer"),
    requireConfirmationModal: true,
  },
];

onMounted(async () => {
  await fetchAccounts();
});

async function fetchAccounts() {
  const response = await getAccounts(config.apiBaseUrl);
  accounts.value = response.data;
}

function onActionSelect(rowData: { action: string; data: Account }) {
  switch (rowData.action) {
    case "editCustomer":
      onEditCustomer(rowData.data);
      break;
    case "deleteCustomer":
      onDeleteCustomer(rowData.data);
      break;
  }
}

function onEditCustomer(customerData: Account) {
  account.value = customerData;
  router.push({ name: "customersEdit", params: { id: customerData.id } });
}

function onDeleteCustomer(customerData: Account) {
  deleteAccount(customerData.id, config.apiBaseUrl);
}

const onCreateCustomer = () => {
  account.value = undefined;
  router.push({ name: "customersAdd" });
};
</script>
