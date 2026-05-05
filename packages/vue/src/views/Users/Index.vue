<template>
  <Table
    id="users-table"
    :columns-data="columns"
    :data="users"
    :data-action-menu="actionMenuData"
    :empty-table-message="t('account.users.table.emptyMessage')"
    :is-loading="isLoading"
    :persist-state="true"
    class="table-users"
    @action:select="onActionSelect"
  >
  </Table>
</template>

<script setup lang="ts">
import type { AppConfig } from "@prefabs.tech/vue3-config";
import type {
  DataActionsMenuItem,
  TableColumnDefinition,
} from "@prefabs.tech/vue3-tanstack-table";

import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Table } from "@prefabs.tech/vue3-tanstack-table";
import { BadgeComponent } from "@prefabs.tech/vue3-ui";
import { computed, h, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import type { AccountUser } from "../../types/AccountUser";
import type { SaasEventHandlers } from "../../types/plugin";

import { useTranslations } from "../../index";
import useUsersStore from "../../stores/AccountUsers";

const props = defineProps({
  account: {
    default: null,
    required: false,
    type: Object,
  },
  isLoading: Boolean,
});

const emit = defineEmits(["user:disabled", "user:enabled"]);

const config = useConfig() as AppConfig;
const messages = useTranslations();
const { t } = useI18n({ messages });
const usersStore = useUsersStore();
const { disableUser, enableUser, getUsers } = usersStore;
const route = useRoute();

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined },
);

// Reactive accountId
const accountId = computed(() => {
  return props.account?.id || (route.params.id as string);
});

const actionMenuData: DataActionsMenuItem[] = [
  {
    confirmationOptions: {
      body: t("account.users.table.confirmation.messages.enable"),
      header: t("account.users.table.confirmation.header"),
    },
    disabled: (data: AccountUser) => Boolean(!data.disabled),
    icon: "pi pi-check",
    key: "enable",
    label: t("account.users.table.actions.enable"),
    requireConfirmationModal: true,
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t("account.users.table.confirmation.messages.disable"),
      header: t("account.users.table.confirmation.header"),
    },
    disabled: (data: AccountUser) => Boolean(data.disabled),
    icon: "pi pi-times",
    key: "disable",
    label: t("account.users.table.actions.disable"),
    requireConfirmationModal: true,
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
    accessorFn: (original) => {
      const name = [
        original.givenName || "",
        original.middleNames || "",
        original.surname || "",
      ]
        .filter(Boolean)
        .join(" ");
      return name || "-";
    },
    cell: ({ getValue }) => {
      const value = getValue();
      return value;
    },
    enableColumnFilter: true,
    header: t("account.users.table.columns.name"),
    id: "name",
  },
  {
    align: "center",
    cell: ({ row: { original } }) => {
      const role = original.role || "";
      return h(BadgeComponent, {
        label: t(`account.users.table.roles.${role}`),
        severity: role === "owner" ? "primary" : "success",
      });
    },
    header: t("account.users.table.columns.roles"),
    id: "roles",
  },
  {
    accessorKey: "signedUpAt",
    cell: ({ row: { original } }) => {
      if (original.signedUpAt) {
        return new Date(original.signedUpAt).toLocaleDateString();
      }
      return "-";
    },
    header: t("account.users.table.columns.signedUpOn"),
  },
  {
    accessorKey: "status",
    align: "center",
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.disabled
          ? t("account.users.table.status.disabled")
          : t("account.users.table.status.enabled"),
        severity: original.disabled ? "danger" : "success",
      }),
    header: t("account.users.table.columns.status"),
  },
];

const users = ref<AccountUser[]>([]);

onMounted(async () => {
  await fetchUsers();
});

async function fetchUsers() {
  try {
    const response = await getUsers(accountId.value, config.apiBaseUrl);
    users.value = response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch users:", error);
  }
}

async function handleDisable(user: AccountUser) {
  try {
    await disableUser(user.id, config.apiBaseUrl);
    await fetchUsers();
    emit("user:disabled", user);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        message: t("account.users.messages.disable.success"),
        type: "success",
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to disable user:", error);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        message: t("account.users.messages.disable.error"),
        type: "error",
      });
    }
  }
}

async function handleEnable(user: AccountUser) {
  try {
    await enableUser(user.id, config.apiBaseUrl);
    await fetchUsers();
    emit("user:enabled", user);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        message: t("account.users.messages.enable.success"),
        type: "success",
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to enable user:", error);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        message: t("account.users.messages.enable.error"),
        type: "error",
      });
    }
  }
}

function onActionSelect(rowData: { action: string; data: AccountUser }) {
  switch (rowData.action) {
    case "disable": {
      handleDisable(rowData.data);
      break;
    }
    case "enable": {
      handleEnable(rowData.data);
      break;
    }
  }
}
</script>
