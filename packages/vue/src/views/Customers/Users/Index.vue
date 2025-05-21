<template>
  <Table
    id="users-table"
    :columns-data="columns"
    :data="users"
    :data-action-menu="actionMenuData"
    :empty-table-message="t('customer.users.table.emptyMessage')"
    :is-loading="isLoading"
    class="table-users"
    @action:select="onActionSelect"
  >
  </Table>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { BadgeComponent } from "@dzangolab/vue3-ui";
import { ref, onMounted, h } from "vue";
import { useRoute } from "vue-router";

import { useTranslations } from "../../../index";
import useUsersStore from "../../../stores/users";

import type { AccountUser } from "../../../types/accountUser";
import type { AppConfig } from "@dzangolab/vue3-config";
import type {
  TableColumnDefinition,
  DataActionsMenuItem,
} from "@dzangolab/vue3-tanstack-table";

defineProps({
  isLoading: Boolean,
});

const emit = defineEmits(["user:disabled", "user:enabled"]);

const config = useConfig() as AppConfig;
const messages = useTranslations();
const { t } = useI18n({ messages });
const usersStore = useUsersStore();
const { getUsers } = usersStore;
const route = useRoute();

const accountId = route.params.id as string;

const actionMenuData: DataActionsMenuItem[] = [
  {
    key: "enable",
    label: t("customer.users.table.actions.enable"),
    icon: "pi pi-check",
    disabled: (data: AccountUser) => Boolean(!data.disabled),
  },
  {
    key: "disable",
    label: t("customer.users.table.actions.disable"),
    icon: "pi pi-times",
    class: "danger",
    disabled: (data: AccountUser) => Boolean(data.disabled),
  },
];

const columns: TableColumnDefinition<AccountUser>[] = [
  {
    accessorKey: "email",
    enableColumnFilter: true,
    enableSorting: true,
    filterPlaceholder: t("customer.users.table.filter.email"),
    header: t("customer.users.table.columns.email"),
  },
  {
    id: "name",
    header: t("customer.users.table.columns.name"),
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
    header: t("customer.users.table.columns.roles"),
    cell: ({ row: { original } }) => {
      const role = original.role || "";
      return h(BadgeComponent, {
        label: t(`customer.users.roles.${role}`),
        severity: role === "owner" ? "primary" : "success",
      });
    },
  },
  {
    accessorKey: "signedUpAt",
    header: t("customer.users.table.columns.signedUpOn"),
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
    header: t("customer.users.table.columns.status"),
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.disabled
          ? t("customer.users.status.disabled")
          : t("customer.users.status.enabled"),
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
    await fetchUsers();
    emit("user:enabled", user);
  } catch (error) {
    console.error("Failed to enable user:", error);
  }
}

async function handleDisable(user: AccountUser) {
  try {
    await fetchUsers();
    emit("user:disabled", user);
  } catch (error) {
    console.error("Failed to disable user:", error);
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
