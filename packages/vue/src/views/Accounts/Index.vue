<template>
  <Page :title="t('accounts.title')">
    <Table
      id="accounts-table"
      :columns-data="columns"
      :data="accounts"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('accounts.table.emptyMessage')"
      :is-loading="isLoading"
      :persist-state="true"
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
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Table } from "@prefabs.tech/vue3-tanstack-table";
import { ButtonElement } from "@prefabs.tech/vue3-ui";
import { inject, ref, onMounted, h } from "vue";
import { useRouter } from "vue-router";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account } from "../../types/account";
import type { SaasEventHandlers, EventMessage } from "../../types/plugin";
import type { AppConfig } from "@prefabs.tech/vue3-config";
import type { TableColumnDefinition } from "@prefabs.tech/vue3-tanstack-table";

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

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined }
);

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

function onCreateCustomer() {
  account.value = undefined;
  router.push({ name: "accountsAdd" });
}

function onDeleteCustomer(customerData: Account) {
  deleteAccount(customerData.id, config.apiBaseUrl);

  const message: EventMessage = {
    type: "success",
    message: t("accounts.messages.deleted"),
  };

  eventHandlers?.notification?.(message);
}

function onEditCustomer(customerData: Account) {
  account.value = customerData;
  router.push({ name: "accountsEdit", params: { id: customerData.id } });
}
</script>
