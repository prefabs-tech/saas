<template>
  <Page :title="t('accounts.title')">
    <Table
      id="accounts-table"
      :columns-data="columns"
      :data="accounts"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('accounts.table.emptyMessage')"
      :is-loading="isLoading"
      class="table-accounts"
      @action:select="onActionSelect"
    >
      <template #toolbar>
        <ButtonElement
          :label="t('accounts.table.actions.addCustomer')"
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
    filterPlaceholder: t("accounts.table.columns.name"),
    header: t("accounts.table.columns.name"),
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
              href: `/accounts/${original.id}`,
              class: "customer-link",
              onClick: (event: Event) => {
                event.preventDefault();
                router.push(`/accounts/${original.id}`);
              },
            },
            original.name
          ),
        ]
      ),
  },
  {
    accessorKey: "registeredNumber",
    header: t("accounts.table.columns.registeredNumber"),
  },
  {
    accessorKey: "taxId",
    header: t("accounts.table.columns.taxId"),
  },
];

const actionMenuData = [
  {
    key: "editCustomer",
    label: t("accounts.table.actions.editCustomer"),
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t("accounts.table.confirmation.deleteCustomer.message"),
      header: t("accounts.table.confirmation.deleteCustomer.header"),
    },
    key: "deleteCustomer",
    label: t("accounts.table.actions.deleteCustomer"),
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
  router.push({ name: "accountsEdit", params: { id: customerData.id } });
}

function onDeleteCustomer(customerData: Account) {
  deleteAccount(customerData.id, config.apiBaseUrl);
}

const onCreateCustomer = () => {
  account.value = undefined;
  router.push({ name: "accountsAdd" });
};
</script>
