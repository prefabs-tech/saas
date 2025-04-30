<template>
  <Page :title="t('accounts.title')">
    <template #toolbar>
      <ButtonElement
        :label="t('accounts.table.actions.addAccount')"
        icon-left="pi pi-plus"
        @click="onCreateAccount"
      />
    </template>

    <Table
      id="accounts-table"
      :columns-data="columns"
      :data="accounts"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('accounts.table.emptyMessage')"
      :paginated="false"
      class="table-accounts"
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
    header: t("accounts.table.columns.name"),
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
    key: "editAccount",
    label: t("accounts.table.actions.updateAccount"),
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t("accounts.table.confirmation.deleteAccount.message"),
      header: t("accounts.table.confirmation.deleteAccount.header"),
    },
    key: "deleteAccount",
    label: t("accounts.table.actions.deleteAccount"),
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
