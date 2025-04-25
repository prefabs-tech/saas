<template>
  <Table
    v-bind="tableOptions"
    :columns-data="mergedColumns"
    :data="users"
    :data-action-menu="actionMenuData"
    :empty-table-message="t('user.table.emptyMessage')"
    :initial-sorting="initialSorting"
    :is-loading="isLoading"
    :is-server-table="isServerTable"
    :pagination-options="{
      pageInputLabel: t('user.table.pagination.pageInputLabel'),
      itemsPerPageControlLabel: t('user.table.pagination.rowsPerPage'),
    }"
    :total-records="totalRecords"
    :visible-columns="visibleColumns"
    class="table-users"
    @action:select="onActionSelect"
    @update:request="onUpdateRequest"
  >
    <template v-if="showInviteAction" #toolbar>
      <div className="table-actions">
        <ButtonElement
          :label="t('user.table.inviteUser')"
          @click="showModal = true"
        />

        <InvitationModal
          :apps="apps"
          :expiry-mode="expiryMode"
          :roles="roles"
          :show="showModal"
          :submit-label="submitLabel"
          :title="invitationModalTitle"
          @on:close="onCloseInvitation"
          @submit="onSubmitInvitation"
        />
      </div>
    </template>
  </Table>
</template>

<script lang="ts">
export default {
  name: "UsersTable",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { BadgeComponent, ButtonElement, formatDate } from "@dzangolab/vue3-ui";
import { computed, h, ref } from "vue";

import { ROLE_ADMIN, STATUS_OK } from "../../constant";
import { useTranslations, emitter } from "../../index";
import useUserStore from "../../store";
import InvitationModal from "../invitation/InvitationModal.vue";

import type {
  InvitationAppOption,
  InvitationPayload,
  InvitationRoleOption,
  UserType,
} from "../../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type {
  DataActionsMenuItem,
  SortingState,
  TableColumnDefinition,
  TRequestJSON,
} from "@dzangolab/vue3-tanstack-table";
import type { PropType } from "vue";

const config = useConfig() as AppConfig;

const messages = useTranslations();

const { t } = useI18n({ messages });

const userStore = useUserStore();
const { addInvitation, disableUser, enableUser } = userStore;

const props = defineProps({
  apps: {
    default: () => [],
    type: Array as PropType<Array<InvitationAppOption>>,
  },
  columnsData: {
    default: () => [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as PropType<TableColumnDefinition<any>[]>,
  },
  dataActionMenu: {
    default: undefined,
    type: [Array, Function] as PropType<
      | DataActionsMenuItem[]
      | ((defaultActionsMenu: DataActionsMenuItem[]) => DataActionsMenuItem[])
    >,
  },
  expiryMode: {
    default: undefined,
    type: String,
    validator: (value: string) => ["calendar", "days"].includes(value),
  },
  initialSorting: {
    default: () => [],
    type: Array as PropType<SortingState>,
  },
  invitationModalTitle: {
    default: "",
    type: String,
  },
  isLoading: Boolean,
  isServerTable: Boolean,
  roles: {
    default: () => [],
    type: Array as PropType<Array<InvitationRoleOption>>,
  },
  showInviteAction: {
    default: true,
    type: Boolean,
  },
  submitLabel: {
    default: undefined,
    type: String,
  },
  tableOptions: {
    default: () => ({}),
    type: Object,
  },
  totalRecords: {
    default: 0,
    type: Number,
  },
  users: {
    default: () => [],
    type: Array as PropType<UserType[]>,
  },
  visibleColumns: {
    default: () => [],
    type: Array as PropType<string[]>,
  },
});

const emit = defineEmits([
  "action:custom",
  "fetch:users",
  "on:closeInvitation",
  "on:submitInvitation",
  "update:request",
]);

const defaultColumns: TableColumnDefinition<UserType>[] = [
  {
    accessorKey: "email",
    enableSorting: true,
    header: t("user.table.defaultColumns.email"),
  },
  {
    accessorFn: (original: UserType) => {
      return (
        (original.givenName ? original.givenName : "") +
          (original.middleNames ? " " + original.middleNames : "") +
          (original.surname ? " " + original.surname : "") || "-"
      );
    },
    accessorKey: "name",
    cell: ({ getValue }) => getValue(),
    enableColumnFilter: true,
    filterPlaceholder: "",
    header: t("user.table.defaultColumns.name"),
  },
  {
    align: "center",
    accessorKey: "roles",
    header: t("user.table.defaultColumns.roles"),
    cell: ({ getValue, row }) => {
      const roles = (row.original as unknown as { roles: string[] })?.roles;
      if (Array.isArray(roles)) {
        return roles.map((role, index) =>
          h(BadgeComponent, {
            label: role,
            severity: role === ROLE_ADMIN ? "primary" : "success",
            fullWidth: true,
            key: role + index,
          }),
        );
      }
      const role = getValue() as string;
      return h(BadgeComponent, {
        label: role,
        severity: role === ROLE_ADMIN ? "primary" : "success",
        fullWidth: true,
      });
    },
  },
  {
    accessorKey: "signedUpAt",
    header: t("user.table.defaultColumns.signedUpAt"),
    cell: ({ row }: { row: { original: UserType } }) =>
      row.original.signedUpAt ? formatDate(row.original.signedUpAt) : "-",
  },
  {
    align: "center",
    accessorKey: "status",
    header: t("user.table.defaultColumns.status"),
    cell: ({ row }: { row: { original: UserType } }) => {
      return h(BadgeComponent, {
        label: row.original.disabled
          ? t("user.table.status.disabled")
          : t("user.table.status.enabled"),
        severity: row.original.disabled ? "danger" : "success",
      });
    },
  },
];

const showModal = ref<boolean>(false);

const actionMenuData = computed(() => {
  const defaultActionMenu = [
    {
      confirmationOptions: {
        body: t("user.table.confirmation.enableUser.message"),
        header: t("user.table.confirmation.header"),
      },
      disabled: (user: UserType) => !user.disabled,
      icon: "pi pi-check",
      key: "enableUser",
      label: t("user.table.actions.enableUser"),
      requireConfirmationModal: true,
    },
    {
      class: "danger",
      confirmationOptions: {
        body: t("user.table.confirmation.disableUser.message"),
        header: t("user.table.confirmation.header"),
      },
      disabled: (user: UserType) => !!user.disabled,
      icon: "pi pi-times",
      key: "disableUser",
      label: t("user.table.actions.disableUser"),
      requireConfirmationModal: true,
    },
  ];

  return props.dataActionMenu
    ? typeof props.dataActionMenu === "function"
      ? props.dataActionMenu(defaultActionMenu)
      : props.dataActionMenu
    : defaultActionMenu;
});

const mergedColumns = computed(() => [
  ...defaultColumns.map((defaultColumn) => {
    const override = props.columnsData.find(
      (column) => column.accessorKey === defaultColumn.accessorKey,
    );
    return override ? { ...defaultColumn, ...override } : defaultColumn;
  }),
  ...props.columnsData.filter(
    (column) =>
      !defaultColumns.some(
        (defaultColumn) => defaultColumn.accessorKey === column.accessorKey,
      ),
  ),
]);

const onActionSelect = (rowData: { action: string; data: UserType }) => {
  switch (rowData.action) {
    case "enableUser":
      onEnableUser(rowData.data?.id);
      break;
    case "disableUser":
      onDisableUser(rowData.data?.id);
      break;
    default:
      emit("action:custom", rowData);
      break;
  }
};

const onCloseInvitation = () => {
  showModal.value = false;

  emit("on:closeInvitation");
};

const onDisableUser = async (id: string) => {
  await disableUser(id, config.apiBaseUrl)
    .then(async (response) => {
      if (response?.data?.status === STATUS_OK) {
        emit("fetch:users");

        emitter.emit("notify", {
          text: t("users.messages.disable.success"),
          type: "success",
        });
      } else {
        emitter.emit("notify", {
          text: t("users.messages.disable.error"),
          type: "success",
        });
      }
    })
    .catch(() => {
      emitter.emit("notify", {
        text: t("users.messages.disable.error"),
        type: "error",
      });
    });
};

const onEnableUser = async (id: string) => {
  await enableUser(id, config.apiBaseUrl)
    .then(async (response) => {
      if (response?.data?.status === STATUS_OK) {
        emit("fetch:users");

        emitter.emit("notify", {
          text: t("users.messages.enable.success"),
          type: "success",
        });
      } else {
        emitter.emit("notify", {
          text: t("users.messages.enable.error"),
          type: "success",
        });
      }
    })
    .catch(() => {
      emitter.emit("notify", {
        text: t("users.messages.enable.error"),
        type: "error",
      });
    });
};

const onSubmitInvitation = async (formData: InvitationPayload) => {
  await addInvitation(formData, config.apiBaseUrl)
    .then((response) => {
      if (response) {
        emitter.emit("notify", {
          text: t("invitations.messages.invite.success"),
          type: "success",
        });
      }
    })
    .catch(() => {
      emitter.emit("notify", {
        text: t("invitations.messages.invite.error"),
        type: "error",
      });
    });

  showModal.value = false;
};

const onUpdateRequest = (invitationRequest: TRequestJSON) => {
  emit("update:request", invitationRequest);
};

defineExpose({
  showModal,
});
</script>

<style lang="css">
@import "../../assets/css/users-table.css";
</style>
