<template>
  <Page :title="t('customers.title')">
    <template #toolbar>
      <ButtonElement
        :label="t('customers.table.actions.addCustomer')"
        icon-left="pi pi-plus"
        @click="onCreateAccount"
      />
    </template>

    <Table
      id="customers-table"
      :columns-data="columns"
      :data="accounts"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('customers.table.emptyMessage')"
      :paginated="false"
      class="table-customers"
      :is-loading="isLoading"
      is-server-table
      @action:select="onActionSelect"
    />
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { ButtonElement } from "@dzangolab/vue3-ui";
import { ref, onMounted } from "vue";
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
    header: t("customers.table.columns.name"),
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
    label: t("customers.table.actions.updateCustomer"),
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
    case "editAccount":
      onEditAccount(rowData.data);
      break;
    case "deleteAccount":
      onDeleteAccount(rowData.data);
      break;
  }
}

function onEditAccount(accountData: Account) {
  account.value = accountData;
  router.push({ name: "accountsEdit", params: { id: accountData.id } });
}

function onDeleteAccount(account: Account) {
  deleteAccount(account.id, config.apiBaseUrl);
}

const onCreateAccount = () => {
  account.value = undefined;
  router.push({ name: "accountsAdd" });
};
</script>
