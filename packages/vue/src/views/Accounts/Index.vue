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
import type { AppConfig } from "@prefabs.tech/vue3-config";
import type { TableColumnDefinition } from "@prefabs.tech/vue3-tanstack-table";

import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Table } from "@prefabs.tech/vue3-tanstack-table";
import { BadgeComponent, ButtonElement } from "@prefabs.tech/vue3-ui";
import { computed, h, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import type { Account } from "../../types/account";
import type { SaasConfig } from "../../types/config";
import type { EventMessage, SaasEventHandlers } from "../../types/plugin";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

defineProps({
  isLoading: Boolean,
});

const accountsStore = useAccountsStore();
const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
const { deleteAccount, getAccounts } = accountsStore;
const config = useConfig() as AppConfig;

const router = useRouter();

const messages = useTranslations();
const { t } = useI18n({ messages });

const accounts = ref<Account[]>([]);
const account = ref<Account | undefined>(undefined);

if (!saasConfig) {
  throw new Error("SAAS config not provided");
}

const { entity } = saasConfig;

// Organization-specific columns
const entityColumnsOrg: TableColumnDefinition<Account>[] = [
  {
    accessorKey: "registeredNumber",
    cell: ({ row: { original } }) => {
      if (!original.registeredNumber) {
        return h("code", "—");
      }
      return original.registeredNumber;
    },
    enableColumnFilter: true,
    enableSorting: true,
    header: t("accounts.table.columns.registeredNumber"),
  },
  {
    accessorKey: "taxId",
    cell: ({ row: { original } }) => {
      if (!original.taxId) {
        return h("code", "—");
      }
      return original.taxId;
    },
    enableColumnFilter: true,
    enableSorting: true,
    header: t("accounts.table.columns.taxId"),
  },
];

// Individual-specific columns
const entityColumnsInd: TableColumnDefinition<Account>[] = [
  {
    accessorKey: "type",
    align: "center",
    cell: ({ row: { original } }) => {
      if (original.individual) {
        return h(BadgeComponent, {
          fullWidth: true,
          label: t("account.type.individual.label"),
        });
      }
      return h(BadgeComponent, {
        fullWidth: true,
        label: t("account.type.organization.label"),
        severity: "success",
      });
    },
    header: t("accounts.table.columns.type"),
  },
];

// Base columns
const defaultColumns: TableColumnDefinition<Account>[] = [
  {
    accessorKey: "name",
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
              class: "customer-link",
              href: `/accounts/${original.id}`,
              onClick: (event: Event) => {
                event.preventDefault();
                router.push(`/accounts/${original.id}`);
              },
            },
            original.name,
          ),
        ],
      ),
    enableColumnFilter: true,
    enableGlobalFilter: true,
    enableSorting: true,
    filterPlaceholder: t("accounts.table.columns.name"),
    header: t("accounts.table.columns.name"),
  },
];

// Computed columns based on entity type
const columns = computed(() => [
  ...defaultColumns,
  ...(entity === "both" || entity === "organization" ? entityColumnsOrg : []),
  ...(entity === "both" ? entityColumnsInd : []),
]);

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
  { notification: undefined },
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
    case "deleteCustomer": {
      onDeleteCustomer(rowData.data);
      break;
    }
    case "editCustomer": {
      onEditCustomer(rowData.data);
      break;
    }
  }
}

function onCreateCustomer() {
  account.value = undefined;
  router.push({ name: "accountsAdd" });
}

function onDeleteCustomer(customerData: Account) {
  deleteAccount(customerData.id, config.apiBaseUrl);

  const message: EventMessage = {
    message: t("accounts.messages.deleted"),
    type: "success",
  };

  eventHandlers?.notification?.(message);
}

function onEditCustomer(customerData: Account) {
  account.value = customerData;
  router.push({ name: "accountsEdit", params: { id: customerData.id } });
}
</script>
