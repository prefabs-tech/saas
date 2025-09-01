<template>
  <Table
    id="users-table"
    :columns-data="columns"
    :data="users"
    :data-action-menu="actionMenuData"
    :empty-table-message="t('account.users.table.emptyMessage')"
    :is-loading="isLoading"
    class="table-users"
    @action:select="onActionSelect"
  >
  </Table>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Table } from "@prefabs.tech/vue3-tanstack-table";
import { BadgeComponent } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, h, inject } from "vue";
import { useRoute } from "vue-router";

import { useTranslations } from "../../index";
import useUsersStore from "../../stores/accountUsers";

import type { AccountUser } from "../../types/accountUser";
import type { SaasEventHandlers } from "../../types/plugin";
import type { AppConfig } from "@prefabs.tech/vue3-config";
import type {
  TableColumnDefinition,
  DataActionsMenuItem,
} from "@prefabs.tech/vue3-tanstack-table";

defineProps({
  isLoading: Boolean,
});

const emit = defineEmits(["user:disabled", "user:enabled"]);

const config = useConfig() as AppConfig;
const messages = useTranslations();
const { t } = useI18n({ messages });
const usersStore = useUsersStore();
const { getUsers, enableUser, disableUser } = usersStore;
const route = useRoute();

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined }
);

const accountId = route.params.id as string;

const actionMenuData: DataActionsMenuItem[] = [
  {
    key: "enable",
    label: t("account.users.table.actions.enable"),
    icon: "pi pi-check",
    disabled: (data: AccountUser) => Boolean(!data.disabled),
    requireConfirmationModal: true,
    confirmationOptions: {
      header: t("account.users.table.confirmation.header"),
      body: t("account.users.table.confirmation.messages.enable"),
    },
  },
  {
    key: "disable",
    label: t("account.users.table.actions.disable"),
    icon: "pi pi-times",
    class: "danger",
    disabled: (data: AccountUser) => Boolean(data.disabled),
    requireConfirmationModal: true,
    confirmationOptions: {
      header: t("account.users.table.confirmation.header"),
      body: t("account.users.table.confirmation.messages.disable"),
    },
  },
];

const columns: TableColumnDefinition<AccountUser>[] = [
  {
    accessorKey: "email",
    enableColumnFilter: true,
    enableSorting: true,
    filterPlaceholder: t("account.users.table.filter.email"),
    header: t("account.users.table.columns.email"),
  },
  {
    id: "name",
    header: t("account.users.table.columns.name"),
    accessorFn: (original) => {
      return (
        (original.givenName ? original.givenName : "") +
          (original.middleNames ? " " + original.middleNames : "") +
          (original.surname ? " " + original.surname : "") || "-"
      );
    },
    cell: ({ getValue }) => {
      const value = getValue();
      return value;
    },
    enableColumnFilter: true,
  },
  {
    align: "center",
    id: "roles",
    header: t("account.users.table.columns.roles"),
    cell: ({ row: { original } }) => {
      const role = original.role || "";
      return h(BadgeComponent, {
        label: t(`account.users.table.roles.${role}`),
        severity: role === "owner" ? "primary" : "success",
      });
    },
  },
  {
    accessorKey: "signedUpAt",
    header: t("account.users.table.columns.signedUpOn"),
    cell: ({ row: { original } }) => {
      if (original.signedUpAt) {
        return new Date(original.signedUpAt).toLocaleDateString();
      }
      return "-";
    },
  },
  {
    align: "center",
    accessorKey: "status",
    header: t("account.users.table.columns.status"),
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.disabled
          ? t("account.users.table.status.disabled")
          : t("account.users.table.status.enabled"),
        severity: original.disabled ? "danger" : "success",
      }),
  },
];

const users = ref<AccountUser[]>([]);

onMounted(async () => {
  await fetchUsers();
});

async function fetchUsers() {
  try {
    const response = await getUsers(accountId, config.apiBaseUrl);
    users.value = response;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

async function handleEnable(user: AccountUser) {
  try {
    await enableUser(user.id, config.apiBaseUrl);
    await fetchUsers();
    emit("user:enabled", user);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.users.messages.enable.success"),
      });
    }
  } catch (error) {
    console.error("Failed to enable user:", error);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.users.messages.enable.error"),
      });
    }
  }
}

async function handleDisable(user: AccountUser) {
  try {
    await disableUser(user.id, config.apiBaseUrl);
    await fetchUsers();
    emit("user:disabled", user);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.users.messages.disable.success"),
      });
    }
  } catch (error) {
    console.error("Failed to disable user:", error);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.users.messages.disable.error"),
      });
    }
  }
}

function onActionSelect(rowData: { action: string; data: AccountUser }) {
  switch (rowData.action) {
    case "enable":
      handleEnable(rowData.data);
      break;
    case "disable":
      handleDisable(rowData.data);
      break;
  }
}
</script>
